package e2e

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/test/utils"
)

const namespace = "vk8s-system"
const vk8sVersion = "1-20" // 1-19, 1-20, 1-21
const registry = "218.233.173.183:31676"

var operatorImage = fmt.Sprintf("%s/scale/workflow/vk8s/controller:test", registry)

var _ = Describe("vk8s", Ordered, func() {
	BeforeAll(func() {

		// Install Ip-Manager on Host Kubernetes Cluster if not exists
		// Ip-Manager needs to be installed becuase vk8s has dependency on Ip-Manager service
		// By("Installing Ip-Manager if not exists")

		By("Creating operator namespace")
		utils.Log("Creating operator namespace")
		cmd := exec.Command("kubectl", "create", "ns", namespace)
		_, _ = utils.Run(cmd)

		By("Build & Install Operator")
		utils.Log("Install Operator")
		cmd = exec.Command("./install.sh", registry)
		_, err := utils.Run(cmd)
		ExpectWithOffset(1, err).NotTo(HaveOccurred())

		By("Validating that the controller-manager pod is running as expected")
		utils.Log("Validating that the controller-manager pod is running as expected")
		verifyControllerUp := func() error {
			// Get pod name
			utils.Log("Get Controller-Manager Pod Name")
			var podOutput []byte
			cmd = exec.Command("kubectl", "get",
				"pods", "-l", "control-plane=controller-manager",
				"-o", "jsonpath='{range .items[?(deletionTimestamp not in @.metadata)]}{.metadata.name}{\"\\n\"}'",
				"-n", namespace,
			)
			podOutput, err = utils.Run(cmd)
			podNames := utils.GetNonEmptyLines(string(podOutput))
			if len(podNames) != 1 {
				return fmt.Errorf("expect 1 controller pods running, but got %d", len(podNames))
			}
			ExpectWithOffset(2, err).NotTo(HaveOccurred())
			controllerPodName := podNames[0]
			utils.Log(fmt.Sprintf("Controller-Manager Pod Name: %s", controllerPodName))
			ExpectWithOffset(2, controllerPodName).Should(ContainSubstring("controller-manager"))

			// Validate pod status
			utils.Log("Check Controller-Manager Pod is Running")
			cmd = exec.Command("kubectl", "get",
				"pods", controllerPodName, "-o", "jsonpath={.status.phase}",
				"-n", namespace,
			)
			status, err := utils.Run(cmd)
			ExpectWithOffset(2, err).NotTo(HaveOccurred())
			if strings.Compare(string(status), "Running") != 0 {
				return fmt.Errorf("controller pod in %s status", status)
			}
			utils.Log("Controller-Manager Pod is Running!!")
			return nil
		}
		EventuallyWithOffset(1, verifyControllerUp, time.Minute, time.Second).Should(Succeed())
	})

	AfterAll(func() {
		By("Uninstalling the Vk8s instance")
		EventuallyWithOffset(1, func() error {
			// Get statefulsets name list before delete vk8s resource
			cmd := exec.Command("kubectl", "get", "vk8s", utils.GetVk8sResourceName(vk8sVersion), "-o",
				"jsonpath='{range .spec.nodes[*]}{.name}{\"\\n\"}'",
				"-n", namespace,
			)
			stsOutput, err := utils.Run(cmd)
			ExpectWithOffset(2, err).NotTo(HaveOccurred())
			stsNames := utils.GetNonEmptyLines(string(stsOutput))
			fmt.Fprintf(GinkgoWriter, "stsNames: %d, %s\n", len(stsNames), stsNames)

			// Delete vk8s resource after get statefulsets name list
			cmd = exec.Command("kubectl", "delete", "vk8s",
				utils.GetVk8sResourceName(vk8sVersion), "-n", namespace,
			)
			_, err = utils.Run(cmd)
			ExpectWithOffset(2, err).NotTo(HaveOccurred())
			// If vk8s deletion success, then delete pvc
			for _, stsName := range stsNames {
				fmt.Fprintf(GinkgoWriter, "delete pvc: %s\n", utils.GetPvcName(stsName))
				cmd = exec.Command("kubectl", "delete", "pvc", utils.GetPvcName(stsName), "-n", namespace)
				_, err = utils.Run(cmd)
				ExpectWithOffset(2, err).NotTo(HaveOccurred())
			}
			return nil
		}).Should(Succeed())
	})

	// Test vk8s CRUD
	Context("Vk8s", func() {
		It("should run successfully", func() {
			projectDir, _ := utils.GetProjectDir()
			labelKey := "update"
			labelValue := "test"
			label := fmt.Sprintf("%s=%s", labelKey, labelValue)

			By("Creating an instance of the Vk8s(CR)")
			utils.Log(fmt.Sprintf("Creating an instance of the Vk8s with version %s", vk8sVersion))
			EventuallyWithOffset(1, func() error {
				// Apply vk8s with sample yaml file
				cmd := exec.Command("kubectl", "apply", "-f", filepath.Join(projectDir,
					fmt.Sprintf("config/samples/vk8s-%s.yaml", vk8sVersion)), "-n", namespace)
				_, err := utils.Run(cmd)
				return err
			}, time.Minute, time.Second).Should(Succeed())

			By("Validating that vk8s status.phase=Running.")
			utils.Log("Validating that vk8s is Running (including kubeflow)")
			getVk8sStatus := func() error {
				// Get vk8s phase
				cmd := exec.Command("kubectl", "get",
					"vk8s", utils.GetVk8sResourceName(vk8sVersion),
					"-o", "jsonpath={.status.phase}", "-n", namespace,
				)
				status, err := utils.Run(cmd)
				fmt.Println(fmt.Sprintf("Vk8s status: %s", string(status)))
				ExpectWithOffset(2, err).NotTo(HaveOccurred())
				if strings.Compare(string(status), "Fail") == 0 {
					return StopTrying("Vk8s phase is  Fail")
				}
				if strings.Compare(string(status), "Running") != 0 {
					return fmt.Errorf("vk8s in %s status", status)
				}
				return nil
			}
			EventuallyWithOffset(1, getVk8sStatus, 20*time.Minute, time.Minute).Should(Succeed())

			By("Validating that kubeflow is installed successfully.")
			utils.Log("Validating that kubeflow is installed successfully")
			curlKubeflowEntryPoint := func() error {
				// Get nodePort of vk8s to access kubeflow UI
				cmd := exec.Command("kubectl", "get", "svc",
					utils.GetVk8sResourceName(vk8sVersion),
					"-ojsonpath={.spec.ports[0].nodePort}",
					"-n", namespace,
				)
				nodePort, err := utils.Run(cmd)
				ExpectWithOffset(2, err).NotTo(HaveOccurred())

				// Access kubeflow UI
				cmd = exec.Command("curl", "-k", fmt.Sprintf("https://localhost:%s", nodePort))
				curlOutput, err := utils.Run(cmd)
				ExpectWithOffset(2, err).NotTo(HaveOccurred())
				if !strings.Contains(string(curlOutput), "kubeflow-oidc-authservice") {
					return fmt.Errorf("kubeflow oidc is not responded")
				}
				utils.Log("Kubeflow is installed successfully!!")
				return nil
			}
			EventuallyWithOffset(1, curlKubeflowEntryPoint, time.Minute, time.Second).Should(Succeed())

			By("Validating that vk8s's label updated successfully.")
			utils.Log("Validating that vk8s's label updated successfully")
			updateVk8sLabel := func() error {
				// Label vk8s
				cmd := exec.Command("kubectl", "label", "vk8s", utils.GetVk8sResourceName(vk8sVersion),
					label, "-n", namespace)
				_, err := utils.Run(cmd)
				ExpectWithOffset(2, err).NotTo(HaveOccurred())

				// Get statefulsets name list of vk8s
				cmd = exec.Command("kubectl", "get", "vk8s", utils.GetVk8sResourceName(vk8sVersion), "-o",
					"jsonpath='{range .spec.nodes[*]}{.name}{\"\\n\"}'",
					"-n", namespace,
				)
				stsOutput, err := utils.Run(cmd)
				ExpectWithOffset(2, err).NotTo(HaveOccurred())
				stsNames := utils.GetNonEmptyLines(string(stsOutput))
				fmt.Fprintf(GinkgoWriter, "stsNames: %d, %s\n", len(stsNames), stsNames)
				if stsNames == nil || len(stsNames) == 0 {
					return fmt.Errorf("stsNames is nil or length is zero, Length: %d", len(stsNames))
				}
				for _, stsName := range stsNames {
					cmd = exec.Command("kubectl", "get", "sts", stsName,
						"-ojsonpath={.metadata.labels}",
						"-n", namespace,
					)
					var labelMap map[string]string
					labelOutput, err := utils.Run(cmd)
					ExpectWithOffset(2, err).NotTo(HaveOccurred())
					err = json.Unmarshal(labelOutput, &labelMap)
					fmt.Fprintf(GinkgoWriter, "labels: %s", labelMap)
					if _, ok := labelMap[labelKey]; !ok {
						// Remove label of vk8s
						cmd = exec.Command("kubectl", "label", "vk8s", utils.GetVk8sResourceName(vk8sVersion),
							fmt.Sprintf("%s-", labelKey), "-n", namespace)
						_, err := utils.Run(cmd)
						ExpectWithOffset(2, err).NotTo(HaveOccurred())
						return fmt.Errorf("Updating vk8s is not working properly")
					}
				}
				utils.Log("Vk8s's label is updated successfully!!")
				return nil
			}
			EventuallyWithOffset(1, updateVk8sLabel, time.Minute, time.Second).Should(Succeed())
		})

	})

})
