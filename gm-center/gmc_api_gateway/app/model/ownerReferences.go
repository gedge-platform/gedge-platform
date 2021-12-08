package model

type OwnerReference struct {
	Name       string `json:"name"`
	Apiversion string `json:"apiVersion"`
	Kind       string `json:"kind"`
}
