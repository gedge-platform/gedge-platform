package model

type CEPH struct {
	ClusterStatus     string      `json:"clusterStatus"`
	Hosts             int         `json:"hostNum"`
	Pgs_per_osd       float64     `json:"pgs_per_osd"`
	PoolNum           int         `json:"poolNum"`
	PGstatus          interface{} `json:"pgStatus"`
	OSD               OSD
	Monitor           Monitor
	Capacity          Capacity
	Object            Object
	ClientPerformance ClientPerformance
}
type OSD struct {
	Total int64 `json:"total"`
	In    int64 `json:"in"`
	Up    int64 `json:"up"`
}
type Monitor struct {
	Total  int         `json:"total"`
	Quorum interface{} `json:"quorum"`
}
type Capacity struct {
	Total float64 `json:"total"`
	Used  float64 `json:"used"`
	Avail float64 `json:"available"`
}
type Object struct {
	Healthy   float64 `json:"healthy"`
	Degraded  float64 `json:"degraded"`
	Misplaced float64 `json:"misplaced"`
	Unfound   float64 `json:"unfound"`
}
type ClientPerformance struct {
	Read_op_per_sec  float64 `json:"read_op_per_sec"`
	Write_op_per_sec float64 `json:"write_op_per_sec"`
	Read_bytes_sec   float64 `json:"read_bytes_sec"`
	Write_bytes_sec  float64 `json:"write_bytes_sec"`
}
type CEPHs []CEPH

func (CEPH) TableName() string {
	return "CEPH_INFO"
}
