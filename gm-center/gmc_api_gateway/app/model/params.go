package model

type PARAMS struct {
	Kind        string `json:"kind,omitempty"`
	Name        string `json:"name,omitempty"`
	Cluster     string `json:"cluster,omitempty"`
	Workspace   string `json:"workspace,omitempty"`
	Project     string `json:"project,omitempty"`
	User        string `json:"user,omitempty"`
	Query       string `json:"query,omitempty"`
	Uid         string `json:"uid,omitempty"`
	Compare     string `json:"compare,omitempty"`
	Method      string `json:"reqMethod,omitempty"`
	Body        string `json:"reqBody,omitempty"`
	Action      string `json:"action,omitempty"`
	QueryString string `json:"queryString,omitempty"`
}
