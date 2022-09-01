package model

import "time"

type CRONJOB struct {
	Workspace                  string       `json:"workspace,omitempty"`
	Cluster                    string       `json:"cluster"`
	Namespace                  string       `json:"project"`
	UserName                   string       `json:"user,omitempty"`
	Name                       string       `json:"name"`
	Schedule                   string       `json:"schedule,omitempty"`
	ConcurrencyPolicy          string       `json:"concurrencyPolicy,omitempty"`
	SuccessfulJobsHistoryLimit int          `json:"successfulJobsHistoryLimit,omitempty"`
	FailedJobsHistoryLimit     int          `json:"failedJobsHistoryLimit,omitempty"`
	LastScheduleTime           time.Time    `json:"lastScheduleTime,omitempty"`
	CreationTimestamp          time.Time    `json:"creationTimestamp,omitempty"`
	Containers                 []Containers `json:"containers,omitempty"`
	Active                     []Active     `json:"active,omitempty"`
	Lable                      interface{}  `json:"label,omitempty"`
	Annotations                interface{}  `json:"annotations,omitempty"`
	Events                     []EVENT      `json:"events,omitempty"`
}
type Active struct {
	Name      string `json:"name"`
	Kind      string `json:"kind"`
	Namespace string `json:"namespace"`
}
type ReferCronJob struct {
	JOBList []JOBList `json:"jobs"`
}
type JOBList struct {
	// Metadata struct {
	Name string `json:"name"`
	// Namespace string `json:"namespace"`
	// } `json:"metadata"`
	// Status struct {
	// Conditions     interface{} `json:"conditions"`
	CompletionTime time.Time `json:"completionTime"`
	StartTime      time.Time `json:"startTime"`
	Succeeded      int       `json:"succeeded"`
	// } `json:"status"`
}
