package model

import "time"

type POD struct {
	Workspace         string             `json:"workspace,omitempty"`
	Cluster           string             `json:"cluster"`
	Name              string             `json:"name"`
	CreationTimestamp time.Time          `json:"creationTimestamp"`
	Namespace         string             `json:"project"`
	Status            string             `json:"status"`
	HostIP            string             `json:"hostIP,omitempty"`
	PodIP             string             `json:"podIP,omitempty"`
	PodIPs            []PodIPs           `json:"podIPs,omitempty"`
	NodeName          string             `json:"node_name,omitempty"`
	Lable             interface{}        `json:"label,omitempty"`
	Annotations       interface{}        `json:"annotations,omitempty"`
	OwnerReference    []OwnerReference   `json:"ownerReferences,omitempty"`
	Podcontainers     []PODCONTAINERS    `json:"Podcontainers,omitempty"`
	QosClass          string             `json:"qosClass,omitempty"`
	StatusConditions  []StatusConditions `json:"statusConditions,omitempty"`
	// VolumeMounts      []VolumeMounts      `json:"volumemounts"`
	ContainerStatuses []ContainerStatuses `json:"containerStatuses,omitempty"`
	Events            []EVENT             `json:"events,omitempty"`
}

type VolumeMounts struct {
	MountPath string `json:"mountpath"`
	Name      string `json:"name"`
	ReadOnly  bool   `json:"readonly"`
}

type PODCONTAINERS struct {
	Name  string `json:"name,omitempty"`
	Image string `json:"image,omitempty"`
	// ReadinessProbe ReadinessProbe `json:"readinessProbe",omitempty`
	// LivenessProbe  LivenessProbe  `json:"livenessProbe",omitempty`
	Ports        []Ports        `json:"ports,omitempty"`
	Env          []ENV          `json:"env,omitempty"`
	VolumeMounts []VolumeMounts `json:"volumemounts"`
}

type ENV struct {
	Name      string    `json:"name,omitempty"`
	Value     string    `json:"value,omitempty"`
	ValueFrom ValueFrom `json:"valueFrom,omitempty"`
}

type ReadinessProbe struct {
	FailureThreshold int `json:"failureThreshold,omitempty"`
	HTTPGET          struct {
		Path   string `json:"path,omitempty"`
		Port   int    `json:"port,omitempty"`
		Scheme string `json:"scheme,omitempty"`
	}
	TcpSocket struct {
		Port string `json:"port,omitempty"`
	}
	InitialDelaySeconds int `json:"initialDelaySeconds,omitempty"`
	PeriodSeconds       int `json:"periodSeconds,omitempty"`
	SuccessThreshold    int `json:"successThreshold,omitempty"`
	TimeoutSeconds      int `json:"timeoutSeconds,omitempty"`
}
type LivenessProbe struct {
	FailureThreshold int `json:"failureThreshold,omitempty"`
	HTTPGET          struct {
		Path   string `json:"path,omitempty"`
		Port   int    `json:"port,omitempty"`
		Scheme string `json:"scheme,omitempty"`
	}
	TcpSocket struct {
		Port string `json:"port,omitempty"`
	}
	InitialDelaySeconds int `json:"initialDelaySeconds,omitempty"`
	PeriodSeconds       int `json:"periodSeconds,omitempty"`
	SuccessThreshold    int `json:"successThreshold,omitempty"`
	TimeoutSeconds      int `json:"timeoutSeconds,omitempty"`
}
type Ports struct {
	Name          string `json:"name,omitempty"`
	ContainerPort int    `json:"containerPort,omitempty"`
	Port          int    `json:"port,omitempty"`
	Protocol      string `json:"protocol,omitempty"`
}
type StatusConditions struct {
	LastTransitionTime time.Time `json:"lastTransitionTime,omitempty"`
	Status             string    `json:"status,omitempty"`
	Type               string    `json:"type,omitempty"`
}
type ContainerStatuses struct {
	ContainerID  string `json:"containerID,omitempty"`
	Name         string `json:"name,omitempty"`
	Ready        bool   `json:"ready,omitempty"`
	RestartCount int    `json:"restartCount"`
	Image        string `json:"image,omitempty"`
	Started      bool   `json:"started,omitempty"`
}
type ValueFrom struct {
	FieldRef        FieldRef        `json:"fieldRef,omitempty"`
	ConfigMapKeyRef ConfigMapKeyRef `json:"configMapKeyRef,omitempty"`
}
type FieldRef struct {
	ApiVersion string `json:"apiVersion,omitempty"`
	FieldPath  string `json:"fieldPath,omitempty"`
}
type ConfigMapKeyRef struct {
	Name string `json:"name,omitempty"`
	Key  string `json:"key,omitempty"`
}

type PodIPs struct {
	Ip string `json:"ip,omitempty"`
}
type DeployInfo struct {
	Metadata struct {
		Name              string           `json:"name,omitempty"`
		Namespace         string           `json:"namespace,omitempty"`
		CreationTimestamp time.Time        `json:"creationTimestamp,omitempty"`
		OwnerReference    []OwnerReference `json:"ownerReferences,omitempty"`
	} `json:"metadata"`
	Status struct {
		ReadyReplicas   int `json:"readyReplicas,omitempty"`
		Replicas        int `json:"replicas,omitempty"`
		UpdatedReplicas int `json:"updatedReplicas,omitempty"`
	} `json:"status"`
}
type ReferDataDeploy struct {
	DeployInfo  []DeployInfo  `json:"deployList"`
	ServiceInfo []ServiceInfo `json:"serviceList"`
}
type ServiceInfo struct {
	Metadata struct {
		Name              string    `json:"name,omitempty"`
		Namespace         string    `json:"namespace,omitempty"`
		CreationTimestamp time.Time `json:"creationTimestamp,omitempty"`
	} `json:"metadata"`
	Subsets []Subsets `json:"subsets,omitempty"`
}
type Subsets struct {
	Addresses []Addresses `json:"addresses,omitempty"`
	Ports     []Ports     `json:"ports,omitempty"`
}
type Addresses struct {
	NodeName string `json:"nodename,omitempty"`
	Ip       string `json:"ip,omitempty"`
}
