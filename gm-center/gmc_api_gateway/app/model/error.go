package model

type Error struct {
	Status string `json:"status"`
	Code   string `json:"code"`
	Data   string `json:"data"`
}
