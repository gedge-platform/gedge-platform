package controllers

// pod metadata
const (
	MASTER        = "master"
	WORKER        = "worker"
	CONTAINERNAME = "node"
	MODULEPATH    = "/lib/modules"
	SRCPATH       = "/usr/src"
)

// exec commands
const (
	INIT            = "./init.sh"
	INITKUBERNETES  = "./init-kubernetes.sh"
	INSTALLKUBEFLOW = "./install-kubeflow.sh"
	RESET           = "./reset-kubernetes.sh"
)
