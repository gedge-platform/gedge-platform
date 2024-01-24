package controllers

// pod metadata
const (
	CONTAINERNAME  = "node"
	MODULEPATHNAME = "lib-modules"
	SRCPATHNAME    = "usr-src"
	VK8SBACKUPNAME = "vk8s-backup"
	MODULEPATH     = "/lib/modules"
	SRCPATH        = "/usr/src"
	VK8SBACKUPPATH = "/vk8s-backup"
)

// exec commands
const (
	INIT            = "./init.sh"
	INITKUBERNETES  = "./init-kubernetes.sh"
	INSTALLKUBEFLOW = "./install-kubeflow.sh"
	RESET           = "./reset-kubernetes.sh"
)

// etc
const (
	SSH_PORT       = 22
	KUBELET_ACTIVE = "active"
	RESERVED       = "0"
)

// kubernetes options
const (
	POD_NETWORK_CIDR = "90.244.0.0/16"
	SERVICE_CIDR     = "90.96.0.0/12"
)

// vk8s finalizer
const FOREGROUNDDELETION = "foregroundDeletion"

// vk8s stopped keywords
const STOP_ANNOTATION = "vk8s-resource-stopped"

// vk8s phase
const (
	CREATING              = "Creating"
	INITIALIZING          = "Initializing"
	JOINING               = "Joining"
	RUNNING               = "Running"
	KUBEFLOW_INITIALIZING = "Kubeflow Initializing"
	DEPLOYED              = "Deployed"
	ERROR                 = "Error"
)

// vk8s phase for scale portal
const (
	VK8S_WAITING           = "Waiting"
	VK8S_PAUSED            = "Paused"
	VK8S_RESTARTING        = "Restarting"
	VK8S_RUNNING           = "Running"
	VK8S_TERMINATING       = "Terminating"
	VK8S_FAIL              = "Fail"
	VK8S_WAITING_NETWORK   = "Waiting Network Connection"
	VK8S_NETWORK_CONNECTED = "Network Connected"
	VK8S_INSTALLING        = "Installing"
)

// vk8s pod status
const (
	WAITING     = "Waiting"
	TERMINATING = "Terminating"
	NOTFOUND    = "Not Found"
)

// vk8s kubernetes setup message
const (
	SUCCESS = "Success"
	FAILED  = "Failed"
)

// gpu node selector key
const (
	GPUNODESELECTOR = "scale/node.gpu.type"
)
