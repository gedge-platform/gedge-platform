/*
Copyright 2023.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controllers

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"math/rand"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/scheme"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	gedgemigv1 "github.com/gedge-platform/gs-linkgw/migration-controller/api/v1"
	"github.com/go-logr/logr"
	corev1 "k8s.io/api/core/v1"
)

// LivmigrationReconciler reconciles a Livmigration object
type LivmigrationReconciler struct {
	client.Client
	Scheme *runtime.Scheme
	Log    logr.Logger
}

/*const (
	// podOwnerKey = ".metadata.controller"
	podOwnerKey = "migPod"
	// migratingPodFinalizer = "podmig.schrej.net/Migrate"
)*/

//+kubebuilder:rbac:groups=gedgemig.gedge.etri.kr,resources=livmigrations,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=gedgemig.gedge.etri.kr,resources=livmigrations/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=gedgemig.gedge.etri.kr,resources=livmigrations/finalizers,verbs=update

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
// TODO(user): Modify the Reconcile function to compare the state specified by
// the Livmigration object against the actual cluster state, and then
// perform operations to make the cluster state reflect the state specified by
// the user.
//
// For more details, check Reconcile and its Result here:
// - https://pkg.go.dev/sigs.k8s.io/controller-runtime@v0.14.4/pkg/reconcile
func (r *LivmigrationReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	//ctx = context.Background()
	log := r.Log.WithValues("livemigration", req.NamespacedName)

	// Set default migration path
	defaultpath := "/mnt/migration"
	default_template_path := "/mnt/migration/template"
	/*
	   Step 0: Fetch Livmigration from the Kubernetes API.
	*/
	// Get migration data from resource object related Livmigration
	// But it's not pod. just resource for process.
	var migPod gedgemigv1.Livmigration
	if err := r.Get(ctx, req.NamespacedName, &migPod); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}
	log.Info("", "Livmigration Request Info", migPod.Spec)

	// Making template for migration from sourcePod (getdSrcPodTempleate)
	var template *corev1.PodTemplateSpec
	if migPod.Spec.Template.ObjectMeta.Name != "" {
		template = &migPod.Spec.Template
	} else {
		var Err error
		template, Err = r.getSrcPodTemplate(ctx, migPod.Spec.SourcePod, req.Namespace, default_template_path)
		if Err != nil || template == nil {
			log.Error(Err, "There is no Source Pod", "pod", migPod.Spec.SourcePod)
			return ctrl.Result{}, Err
		}
	}

	// Target Destination to migrate sourcepod is from migPod.Spec then write it to template file
	if migPod.Spec.DestAddr != "" {
		template.Spec.NodeSelector = map[string]string{"kubernetes.io/hostname": migPod.Spec.DestAddr}
	}

	// The required labels and annotations is getting from template (migPod)
	reqLabels := getPodsLabel(template)
	reqLabels["migPod"] = migPod.Name
	annotations := getPodsAnnotation(&migPod, template)

	// All pod and resources matched with the required labels are listed in subpods
	var subPods corev1.PodList
	if err := r.List(ctx, &subPods, client.InNamespace(req.Namespace), client.MatchingLabels(reqLabels)); err != nil {
		log.Error(err, "Child pods dose not exists")
		return ctrl.Result{}, err
	}

	// From the labels, The labeled pods are searched
	pod, err := r.reqPod(migPod, &migPod, req.Namespace, template)
	if err != nil {
		return ctrl.Result{}, err
	}

	count, _, _ := r.getRunningPod(&subPods)

	log.Info("", "Annotations ", annotations["snapshotPath"])
	log.Info("", "Number of pods ", len(subPods.Items))
	log.Info("", "Requested pod ", pod)
	log.Info("", "Number of requested pod ", migPod.Spec.Replicas)
	log.Info("", "Number of actual running pod ", count)

	switch annotations["snapshotPolicy"] {
	case "live-migration":
		// 1: Source pod check if it exists
		sourcePod, err := r.podExist(ctx, annotations["sourcePod"], req.Namespace)
		if err != nil || sourcePod == nil {
			log.Error(err, "sourcePod not exist", "pod", annotations["sourcePod"])
			return ctrl.Result{}, err
		}
		log.Info("", "live-migration", "- Inside cluster - 1 - Check source pod exist and running - finished")
		log.Info("", "live-migration", "- Inside cluster - 1 - SourcePod status: "+sourcePod.Status.Phase)

		// 2: Clean previous checkpoint folder if exist
		presnapshotPath := defaultpath + "/" + annotations["sourcePod"]
		if err := r.removeCheckpoint(ctx, sourcePod, presnapshotPath, "", req.Namespace); err != nil {
			log.Error(err, "unable to remove checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		log.Info("", "live-migration", "- Inside cluster - 2 - Clean previous checkpoint folder if exist - finished")

		// 3: Checkpoint the source pod now
		if err := r.checkpointPod(ctx, sourcePod, defaultpath); err != nil {
			log.Error(err, "unable to checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}

		// 4: wait until checkpoint info are created
		container := sourcePod.Spec.Containers[0].Name
		checkpointPath := path.Join(defaultpath, annotations["sourcePod"], container)

		var i int
		for i := 1; i <= 5; i++ {
			err := checkpoint_validation(checkpointPath)
			if err == nil {
				break
			} else {
				time.Sleep(100 * time.Millisecond)
				log.Info("", "live-migration", "- Inside cluster - Waiting for snapshot image ")
			}

		}
		if i == 5 {
			log.Error(err, "sourcePod can't restore. Chekcpoint dosen't exists", "pod", annotations["sourcePod"])
			return ctrl.Result{}, err
		}

		log.Info("", "live-migration", "- Inside cluseter - 3 - Snapshot status check completed - finished")
		log.Info("", "live-migration", "- Inside cluseter - 4 - Snapshot created and saved it - finished")

		// 5: restore destPod from sourcePod checkpoted info
		newPod, err := r.restorePod(ctx, pod, annotations["sourcePod"], checkpointPath)
		if err != nil {
			log.Error(err, "unable to restore", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		log.Info("", "live-migration", "- Inside cluster - 5 - Restore destPod from sourcePod's checkpointed info - finished")

		for {
			status, _ := r.podExist(ctx, newPod.Name, req.Namespace)
			if status != nil {
				log.Info("", "live-migration", "- Insied cluster - 5 - Check whether newPod is Running or not - finished"+status.Name+string(status.Status.Phase))
				break
			} else {
				time.Sleep(200 * time.Millisecond)
			}
		}
		log.Info("", "live-migration", "- Inside cluster - 5 - Check whether newPod is Running or not - finished")

		// 6: Delete source Pod
		if err := r.deletePod(ctx, sourcePod); err != nil {
			log.Error(err, "unable to delete", "source pod", sourcePod)
			return ctrl.Result{}, err
		}
		log.Info("", "live-migration", "- Inside cluster - 6 - Delete the source pod - finished")

	case "restore":
		// 1: Same pod check if it exists
		sourcePod, err := r.podExist(ctx, annotations["sourcePod"], req.Namespace)
		if err == nil && sourcePod != nil {
			log.Error(err, "sourcePod can't restore. SourcePod name exists", "pod", annotations["sourcePod"])
			return ctrl.Result{}, err
		}
		log.Info("", "Restore", "- between clusters - 1 - Check source pod exist and running - finished")

		// 2: Getting Checkpoint path
		container := pod.Spec.Containers[0].Name
		checkpointPath := path.Join(defaultpath, annotations["sourcePod"], container)

		var i int
		for i := 1; i <= 5; i++ {
			err := checkpoint_validation(checkpointPath)
			if err == nil {
				break
			} else {
				time.Sleep(100 * time.Millisecond)
			}

		}
		if i == 5 {
			log.Error(err, "sourcePod can't restore. Chekcpoint dosen't exists", "pod", annotations["sourcePod"])
			return ctrl.Result{}, err
		}
		log.Info("", "Restore", "- between clusters - 2 - Check theat snapshot exists in chekpoint path  - finished")

		// 3: Restore pod from Checkpoint path
		newPod, err := r.restorePod(ctx, pod, annotations["sourcePod"], annotations["snapshotPath"])
		if err != nil {
			log.Error(err, "unable to restore", "pod", pod)
			return ctrl.Result{}, err
		}
		log.Info("", "Restore", "- between clusters - 3 - Restore destPod from sourcePod's checkpointed info - finished")

		for {
			status, _ := r.podExist(ctx, newPod.Name, req.Namespace)
			if status != nil {
				log.Info("", "Restore", "- between clusters - 3 - Check whether newPod is Running or not - finished"+status.Name+string(status.Status.Phase))
				break
			} else {
				time.Sleep(200 * time.Millisecond)
			}
		}
		log.Info("", "Restore", "- between clusters - 3 - Check whether newPod is Running or not - finished")

	case "checkpoint":
		// Check that pod exists.
		sourcePod, err := r.podExist(ctx, annotations["sourcePod"], req.Namespace)
		if err != nil || sourcePod == nil {
			log.Error(err, "sourcePod not exist", "pod", annotations["sourcePod"])
			return ctrl.Result{}, err
		}
		log.Info("", "Checkpoint", "-- 1 - Check source pod exist and running - finished")

		// --2: Clean previous checkpoint folder if exist
		presnapshotPath := annotations["snapshotPath"] + "/" + annotations["sourcePod"]
		if err := r.removeCheckpoint(ctx, sourcePod, presnapshotPath, "", req.Namespace); err != nil {
			log.Error(err, "unable to remove checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		log.Info("", "Checkpoint", "-- 2 - Clean previous checkpoint folder if exist - finished")

		// --3: Checkpoint the source pod now
		if err := r.checkpointPod(ctx, sourcePod, annotations["snapshotPath"]); err != nil {
			log.Error(err, "unable to checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		log.Info("", "Checkpoint", "-- 3 - Checkpoint source Pod and save it - finished")

	}

	return ctrl.Result{}, nil
}

func (r *LivmigrationReconciler) checkpointPod(ctx context.Context, pod *corev1.Pod, snapshotPath string) error {
	snapshotPolicy := "checkpoint"
	if snapshotPath == "" {
		fmt.Println("Checkpoint Image Path is not specified!", snapshotPath)
		return nil
	}
	if err := r.updateAnnotations(ctx, pod, snapshotPolicy, snapshotPath); err != nil {
		return err
	}
	return nil
}

func (r *LivmigrationReconciler) removeCheckpoint(ctx context.Context, pod *corev1.Pod, currentPath, newPodName, namespace string) error {
	if newPodName != "" {
		for {
			ok, _ := r.podExist(ctx, newPodName, namespace)
			if ok != nil {
				break
			}
		}
	}
	snapshotPolicyUpdate := ""
	snapshotPathUpdate := ""
	if err := r.updateAnnotations(ctx, pod, snapshotPolicyUpdate, snapshotPathUpdate); err != nil {
		return err
	}
	if _, err := os.Stat(currentPath); os.IsNotExist(err) {
		return nil
	}
	cmd := exec.Command("sudo", "rm", "-rf", currentPath)
	fmt.Println(cmd)
	if _, err := cmd.Output(); err != nil {
		return err
	}

	return nil
}

func (r *LivmigrationReconciler) updateAnnotations(ctx context.Context, pod *corev1.Pod, snapshotPolicy, snapshotPath string) error {
	newAnnotaion := pod.ObjectMeta.Annotations
	if newAnnotaion == nil {
		newAnnotaion = make(map[string]string)
	}
	newAnnotaion["snapshotPolicy"] = snapshotPolicy
	newAnnotaion["snapshotPath"] = snapshotPath
	fmt.Println(newAnnotaion)
	pod.ObjectMeta.Annotations = newAnnotaion
	if err := r.Update(ctx, pod); err != nil {
		return err
	}
	return nil
}

func (r *LivmigrationReconciler) restorePod(ctx context.Context, pod *corev1.Pod, sourcePod, checkpointPath string) (*corev1.Pod, error) {
	s1 := rand.NewSource(time.Now().UnixNano())
	number := rand.New(s1)
	sourcePod = strings.Split(sourcePod, "-migration-")[0]
	pod.Name = sourcePod + "-migration-" + strconv.Itoa(number.Intn(100))

	pod.ObjectMeta.Annotations["snapshotPolicy"] = "restore"
	pod.ObjectMeta.Annotations["snapshotPath"] = checkpointPath + "/" + sourcePod
	if err := r.Create(ctx, pod); err != nil {
		return nil, err
	}
	return pod, nil
}

func (r *LivmigrationReconciler) deletePod(ctx context.Context, pod *corev1.Pod) error {
	if err := r.Delete(ctx, pod); err != nil {
		return err
	}
	return nil
}

func (r *LivmigrationReconciler) getRunningPod(subPods *corev1.PodList) (int, corev1.PodList, corev1.PodList) {
	// if a pod is deleted, remove it from Actual running pod list
	count := 0
	var RunningPod, DeletingPod corev1.PodList
	for _, pod := range subPods.Items {
		if !pod.DeletionTimestamp.IsZero() {
			DeletingPod.Items = append(DeletingPod.Items, pod)
		} else {
			RunningPod.Items = append(RunningPod.Items, pod)
			count++
		}
	}
	return count, RunningPod, DeletingPod
}

func (r *LivmigrationReconciler) reqPod(migPod gedgemigv1.Livmigration, parentObject runtime.Object, namespace string, template *corev1.PodTemplateSpec) (*corev1.Pod, error) {
	reqLabels := getPodsLabel(template)
	reqFinalizers := getPodsFinalizers(template)
	reqAnnotations := getPodsAnnotation(&migPod, template)
	accessor, _ := meta.Accessor(parentObject)
	prefix := getPodsPrefix(accessor.GetName())
	pod := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Namespace:    namespace,
			Labels:       reqLabels,
			Finalizers:   reqFinalizers,
			Annotations:  reqAnnotations,
			GenerateName: prefix,
		},
	}
	pod.Spec = *template.Spec.DeepCopy()
	if err := ctrl.SetControllerReference(&migPod, pod, r.Scheme); err != nil {
		return pod, err
	}
	return pod, nil
}

func getPodsFinalizers(template *corev1.PodTemplateSpec) []string {
	reqFinalizers := make([]string, len(template.Finalizers))
	copy(reqFinalizers, template.Finalizers)
	return reqFinalizers
}

func getPodsPrefix(controllerName string) string {
	prefix := fmt.Sprintf("%s-", controllerName)

	return prefix
}

func RemoveString(s []string, i int) []string {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}

// Get From Label Set
func getPodsLabel(template *corev1.PodTemplateSpec) labels.Set {
	reqLabels := make(labels.Set)
	for i, n := range template.Labels {
		reqLabels[i] = n
	}
	return reqLabels
}

// Get From Annotaion Set
func getPodsAnnotation(migPod *gedgemigv1.Livmigration, template *corev1.PodTemplateSpec) labels.Set {
	reqAnnotations := make(labels.Set)
	for i, n := range template.Annotations {
		reqAnnotations[i] = n
	}

	reqAnnotations["sourcePod"] = migPod.Spec.SourcePod
	reqAnnotations["snapshotPolicy"] = migPod.Spec.Operation
	reqAnnotations["snapshotPath"] = migPod.Spec.SnapshotPath
	return reqAnnotations
}

func (r *LivmigrationReconciler) podExist(ctx context.Context, name, namespace string) (*corev1.Pod, error) {
	var childPods corev1.PodList
	if err := r.List(ctx, &childPods, client.InNamespace(namespace)); err != nil {
		return nil, err
	}
	if len(childPods.Items) > 0 {
		for _, pod := range childPods.Items {
			if pod.Name == name && pod.Status.Phase == "Running" {
				return &pod, nil
			}
		}

	}
	return nil, nil
}

func (r *LivmigrationReconciler) getSrcPodTemplate(ctx context.Context, sourcePodName string, namespace string, defaulttemplate string) (*corev1.PodTemplateSpec, error) {
	sourcePod, _ := r.podExist(ctx, sourcePodName, namespace)
	if sourcePod == nil {
		decode := scheme.Codecs.UniversalDeserializer().Decode
		stream, err := os.ReadFile(defaulttemplate + "/" + sourcePodName + "_template.yaml")
		if stream == nil {
			return nil, err
		}
		obj, gKV, _ := decode(stream, nil, nil)
		if gKV.Kind == "Pod" {
			sourcePod = obj.(*corev1.Pod)
		}

	}

	pod := sourcePod.DeepCopy()
	container := pod.Spec.Containers[0]
	template := &corev1.PodTemplateSpec{
		ObjectMeta: pod.ObjectMeta,
		Spec: corev1.PodSpec{
			Containers: []corev1.Container{
				{
					Name:         container.Name,
					Image:        container.Image,
					Ports:        container.Ports,
					VolumeMounts: container.VolumeMounts,
				},
			},
			Volumes: pod.Spec.Volumes,
		},
	}
	return template, nil
}

func searchfile(root, name string) (*os.File, error) {
	var f *os.File
	filepath.WalkDir(root, func(s string, d fs.DirEntry, e error) error {
		if e != nil {
			return e
		}
		if d.Name() != name {
			return nil
		}
		f, e = os.Open(s)
		if e != nil {
			return e
		}
		return errors.New("found")
	})
	if f == nil {
		return nil, errors.New("not found")
	}
	return f, nil
}

func checkpoint_validation(path string) error {
	f, e := searchfile(path, "descriptors.json")
	if e != nil {
		return e
	}
	defer f.Close()
	return nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *LivmigrationReconciler) SetupWithManager(mgr ctrl.Manager) error {

	/*	ctx := context.Background()
		if err := mgr.GetFieldIndexer().IndexField(ctx, &corev1.Pod{}, podOwnerKey, func(o client.Object) []string {
			pod := o.(*corev1.Pod)
			owner := metav1.GetControllerOf(pod)
			if owner == nil {
				return nil
			}
			if owner.Kind != "Livmigration" {
				return nil
			}

			return []string{owner.Name}
		}); err != nil {
			return err
		}
	*/
	return ctrl.NewControllerManagedBy(mgr).
		For(&gedgemigv1.Livmigration{}).
		Complete(r)
}
