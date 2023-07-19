/*
Copyright 2022.

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
	"fmt"
	"math/rand"
	"os"
	"os/exec"
	"path"
	"strconv"
	"strings"
	"time"

	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/go-logr/logr"
	gedgemigv1 "github.com/src/gedge.com/Livmigration/api/v1"
	corev1 "k8s.io/api/core/v1"
)

const (
	//podOwnerKey = "migPod"
	podOwnerKey = ".metadata.controller"
)

// LivmigrationReconciler reconciles a Livmigration object
type LivmigrationReconciler struct {
	client.Client
	Log    logr.Logger
	Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=gedgemig.etri.re.kr,resources=livmigrations,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=gedgemig.etri.re.kr,resources=livmigrations/status,verbs=get;update;patch

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
// TODO(user): Modify the Reconcile function to compare the state specified by
// the Livmigration object against the actual cluster state, and then
// perform operations to make the cluster state reflect the state specified by
// the user.
//
// For more details, check Reconcile and its Result here:
// - https://pkg.go.dev/sigs.k8s.io/controller-runtime@v0.10.0/pkg/reconcile
func (r *LivmigrationReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	//log := r.Log.WithValues("Livmigration", req.NamespacedName)

	/*
	   Step 0: Fetch Livmigration from the Kubernetes API.
	*/
	var migPod gedgemigv1.Livmigration
	if err := r.Get(ctx, req.NamespacedName, &migPod); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}
	// Get migration data from resource object related Livmigration
	// But it's not pod. just resource for process.

	//log.Info("", "Test Print", migPod.Spec)

	// We make template for migration from sourcePod (getdSrcPodTempleate)
	var template *corev1.PodTemplateSpec
	if migPod.Spec.Template.ObjectMeta.Name != "" {
		template = &migPod.Spec.Template
	} else {
		var Err error
		template, Err = r.getSrcPodTemplate(ctx, migPod.Spec.SourcePod, req.Namespace)
		if Err != nil || template == nil {
			fmt.Println(Err, "There is no Source Pod", "pod", migPod.Spec.SourcePod)
			return ctrl.Result{}, Err
		}
	}

	// Target Destination to migrate sourcepod is from migPod.Spec then write it to template file
	if migPod.Spec.DestHost != "" {
		template.Spec.NodeSelector = map[string]string{"kubernetes.io/hostname": migPod.Spec.DestHost}
	}

	// The required labels and annotations is getting from template (migPod)
	reqLabels := getPodsLabel(template)
	reqLabels["migPod"] = migPod.Name
	annotations := getPodsAnnotation(&migPod, template)

	// All pod and resources matched with the required labels are listed in subpods
	var subPods corev1.PodList
	if err := r.List(ctx, &subPods, client.InNamespace(req.Namespace), client.MatchingLabels(reqLabels)); err != nil {
		fmt.Println(err, "No Child Pods!")
		return ctrl.Result{}, err
	}

	// From the labels, The labeled pods are searched
	pod, err := r.reqPod(migPod, &migPod, req.Namespace, template)
	if err != nil {
		return ctrl.Result{}, err
	}

	//deployment, err := r.reqDeployment(migPod, &migPod, req.Namespace, template)
	//if err != nil {
	//	return ctrl.Result{}, err
	//}

	count, _, _ := r.getRunningPod(&subPods)

	fmt.Println("---Migration Info---")
	fmt.Printf("Annotaions: %s\n", annotations["migrationProcess"])
	fmt.Printf("Total Pods: %d\n", len(subPods.Items))
	//fmt.Printf("Reqested Pod: %s\n", pod)
	fmt.Printf("Reqested subPods: %d\n", migPod.Spec.Replicas)
	fmt.Printf("Running subPods: %d\n", count)

	if annotations["migrationProcess"] == "live-process" && annotations["sourcePod"] != "" {
		// Live Migration Process
		// Step1 - Check source pod and clean previous Source pod checkpoint/restore annotations and ImagePath
		sourcePod, err := r.podExist(ctx, annotations["sourcePod"], req.Namespace)
		if err != nil || sourcePod == nil {
			fmt.Println(err, "Step 1: sourcePod dosen't exist", annotations["sourcePod"])
			return ctrl.Result{}, err
		}
		if err := r.removeCheckpoint(ctx, sourcePod, annotations["snapshotimgPath"], "", req.Namespace); err != nil {
			fmt.Println(err, "Step 1: Can't remove checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		fmt.Println("", "Step 1: sourcePod ", sourcePod)
		fmt.Println("", "Step 1: sourcePod status ", sourcePod.Status.Phase)
		fmt.Println("", "Live-migration Process", "Step 1 completed!")

		// Step2: checkpoint sourcePod
		if err := r.checkpointPod(ctx, sourcePod, ""); err != nil {
			fmt.Println(err, "Step 2: Can't make checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		fmt.Println("", "Live-migration Process", "Step 2 checkpoint making completed!")

		// Step3: wait until checkpoint info are created
		container := sourcePod.Spec.Containers[0].Name
		checkpointPath := path.Join(annotations["snapshotimgPath"], strings.Split(sourcePod.Name, "-")[0])
		fmt.Println("", "Step 3: Migration pod", container)
		for {
			_, err := os.Stat(path.Join(checkpointPath, container, "descriptors.json"))
			if os.IsNotExist(err) {
				//time.Sleep(100 * time.Millisecond)
			} else {
				break
			}
		}
		fmt.Println("", "Live-migration", "Step 3: CheckpointPath - "+checkpointPath)
		fmt.Println("", "Live-migration", "Step 3 checkpoint info are created!")

		// Step4: Restore Pod from sourcePod with checkpoted info
		newPod, err := r.restorePod(ctx, pod, annotations["sourcePod"], checkpointPath)
		if err != nil {
			fmt.Println(err, "Step 4: Can't restore", "pod", sourcePod)
			return ctrl.Result{}, err
		}

		for {
			status, _ := r.podExist(ctx, newPod.Name, req.Namespace)
			if status != nil {
				fmt.Println("", "Step 4: NewPod is Running"+status.Name+string(status.Status.Phase))
				break
			} else {
				time.Sleep(200 * time.Millisecond)
			}
		}
		fmt.Println("", "Live-migration Process", "Step 4  Pod Restored from sourcePod's checkpoint!")

		// // Step 5: Delete source Pod
		if err := r.deletePod(ctx, sourcePod); err != nil {
			fmt.Println(err, "unable to delete", "source pod", sourcePod)
			return ctrl.Result{}, err
		}
		fmt.Println("", "Live-migration Process", "Step 5 The source pod is delete")
		return ctrl.Result{}, nil

	} else if annotations["migrationProcess"] == "checkpoint" && annotations["sourcePod"] != "" {

		// Step1: Checkpoint Directory Check!
		_, err := os.Stat(annotations["snapshotImgPath"])
		if err != nil {
			fmt.Println(err, annotations["snapshotImgPath"], "dosen't exist!")
			return ctrl.Result{}, err
		}

		// Step2: Check if source pod exists or not
		sourcePod, err := r.podExist(ctx, annotations["sourcePod"], req.Namespace)
		// r.podExist return a running pod name which is reqested
		if err != nil || sourcePod == nil {
			fmt.Println(err, "sourcePod", annotations["sourcePod"], "dosen't exist")
			return ctrl.Result{}, err
		}
		fmt.Println("", "Checkpoint", "Step 1 - Checking the snapshotPath and source pod is completed!")

		// Step2: Clean previous checkpoint folder if exist
		if err := r.removeCheckpoint(ctx, sourcePod, annotations["snapshotImgPath"], "", req.Namespace); err != nil {
			fmt.Println(err, "unable to remove checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		fmt.Println("", "Checkpoint", "Step 2 - Clean previous checkpoint folder if exist - completed")

		// Step3: Checkpoint the source pod now
		if err := r.checkpointPod(ctx, sourcePod, annotations["snapshotImgPath"]); err != nil {
			fmt.Println(err, "unable to checkpoint", "pod", sourcePod)
			return ctrl.Result{}, err
		}
		fmt.Println("", "Checkpoint", "Step 3 - Checkpoint source Pod and save it - completed")
	}

	return ctrl.Result{Requeue: true}, nil
}

func (r *LivmigrationReconciler) checkpointPod(ctx context.Context, pod *corev1.Pod, CheckpointImgPath string) error {
	MigrationProcess := "checkpoint"
	if CheckpointImgPath == "" {
		fmt.Println("Checkpoint Image Path is not specified!", CheckpointImgPath)
		return nil
	}
	if err := r.updateAnnotations(ctx, pod, MigrationProcess, CheckpointImgPath); err != nil {
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
	MigrationprocessUpdate := ""
	CheckpointImgPathUpdate := ""
	if err := r.updateAnnotations(ctx, pod, MigrationprocessUpdate, CheckpointImgPathUpdate); err != nil {
		return err
	}
	os.Chmod(currentPath, 0777)
	path := fmt.Sprintf("%s/*", currentPath)
	cmd := exec.Command("sudo", "rm", "-rf", path)
	fmt.Println(cmd)
	stdout, err := cmd.Output()
	fmt.Println(fmt.Sprint(err) + ": " + string(stdout))

	return nil
}

func (r *LivmigrationReconciler) updateAnnotations(ctx context.Context, pod *corev1.Pod, MigrationProcess, CheckpointImgPath string) error {
	newAnnotaion := pod.ObjectMeta.Annotations
	if newAnnotaion == nil {
		newAnnotaion = make(map[string]string)
	}
	newAnnotaion["migrationProcess"] = MigrationProcess
	newAnnotaion["snapshotImgPath"] = CheckpointImgPath
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

	pod.ObjectMeta.Annotations["migrationProcess"] = "restore"
	pod.ObjectMeta.Annotations["snapshotImgPath"] = checkpointPath
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

/*
func (r *LivmigrationReconciler) reqDeployment(migPod gedgemigv1.Livmigration, parentObject runtime.Object, namespace string, template *corev1.PodTemplateSpec) (*appsv1.Deployment, error) {

	reqLabels := getPodsLabel(template)
	reqFinalizers := getPodsFinalizers(template)
	reqAnnotations := getPodsAnnotation(&migPod, template)
	accessor, _ := meta.Accessor(parentObject)
	prefix := getPodsPrefix(accessor.GetName())
	podSpec := *template.Spec.DeepCopy()
	replicas := int32(migPod.Spec.Replicas)
	reqLabels["migPod"] = migPod.Name
	deployment := &appsv1.Deployment{
		TypeMeta: metav1.TypeMeta{APIVersion: appsv1.SchemeGroupVersion.String(), Kind: "Deployment"},
		ObjectMeta: metav1.ObjectMeta{
			Name:      migPod.Name,
			Namespace: migPod.Namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Selector: &metav1.LabelSelector{
				MatchLabels: reqLabels,
			},
			Replicas: &replicas,
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Namespace:    namespace,
					Labels:       reqLabels,
					Finalizers:   reqFinalizers,
					Annotations:  reqAnnotations,
					GenerateName: prefix,
				},
				Spec: podSpec,
			},
		},
	}
	if err := ctrl.SetControllerReference(&migPod, deployment, r.Scheme); err != nil {
		return deployment, err
	}
	return deployment, nil
}
*/
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
	reqAnnotations["migrationProcess"] = migPod.Spec.Action
	reqAnnotations["snapshotImgPath"] = migPod.Spec.SnapshotimgPath
	return reqAnnotations
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

func (r *LivmigrationReconciler) getSrcPodTemplate(ctx context.Context, sourcePodName string, namespace string) (*corev1.PodTemplateSpec, error) {
	sourcePod, err := r.podExist(ctx, sourcePodName, namespace)
	if sourcePod == nil {
		return nil, err
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

// SetupWithManager sets up the controller with the Manager.
func (r *LivmigrationReconciler) SetupWithManager(mgr ctrl.Manager) error {
	ctx := context.Background()
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
	return ctrl.NewControllerManagedBy(mgr).
		For(&gedgemigv1.Livmigration{}).
		Owns(&corev1.Pod{}).
		Complete(r)
}

func FieldIndexer() {
	panic("unimplemented")
}
