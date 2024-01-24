package util

import (
	"fmt"
	"log"
	"net/http"
)

func FailOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}
func CheckHttpError(w http.ResponseWriter, err error, msg string) bool {
	if err != nil {
		http.Error(w, msg, http.StatusInternalServerError)
		fmt.Println(err)
		return true
	}
	return false
}
