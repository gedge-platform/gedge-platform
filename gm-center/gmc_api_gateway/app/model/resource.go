package model

type Resource_usage struct {
	Namespace_cpu    float64 `json:"cpu_usage"`
	Namespace_memory float64 `json:"memory_usage"`
}

type Resource_cnt struct {
	NamespaceCount   int `json:"namespace_count"`
	DeploymentCount  int `json:"deployment_count"`
	DaemonsetCount   int `json:"daemonset_count"`
	StatefulsetCount int `json:"Statefulset_count"`
	PodCount         int `json:"pod_count"`
	ServiceCount     int `json:"service_count"`
	CronjobCount     int `json:"cronjob_count"`
	JobCount         int `json:"job_count"`
	VolumeCount      int `json:"volume_count"`
}
