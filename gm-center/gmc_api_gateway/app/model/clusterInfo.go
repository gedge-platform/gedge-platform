package model

type ClusterInfo struct {
	ClusterName string     `json:"cluster"`
	Type        string     `json:"type"`
	Nodes       []NodeInfo `json:"nodes"`
}
type NodeInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Ip   string `json:"Ip"`
}

func (ClusterInfo) TableName() string {
	return "CLUSTER_INFO"
}
