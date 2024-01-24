package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"reflect"

	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/typing"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

var server string = ""

func init() {
	profile, exists := os.LookupEnv("PROFILE")
	var host string
	var port int
	if profile == "local" {
		host = "192.168.202.204"
		port = 20880
	} else {
		if profile == "kube" || !exists {
			host = "ip-manager.vk8s-system.svc.cluster.local"
			port = 5002
		}
	}
	basePath := "api"
	server = fmt.Sprintf("http://%s:%d/%s", host, port, basePath)
}

type HttpReturn struct {
	err error
	ip  IP
}

type IP struct {
	PodIP   string        `json:"pod_ip"`
	Status  typing.Status `json:"status"`
	PodName string        `json:"pod_name"`
}

func getFreeIP() (IP, error) {
	ret := make(chan HttpReturn)
	go sendGetRequest(ret)
	result := <-ret
	freeIP := result.ip
	err := result.err
	if reflect.DeepEqual(freeIP, IP{}) {
		return IP{}, typing.ErrIpNotFound
	}
	return freeIP, err
}

func updateIPStatus(ip IP) error {
	ret := make(chan HttpReturn)
	go sendPutRequest(ret, ip)
	result := <-ret
	return result.err
}

func sendGetRequest(ret chan HttpReturn) {
	var ip IP
	var retErr error
	req, err := http.NewRequest(
		http.MethodGet,
		fmt.Sprintf("%s/%s", server, "free-ip"),
		nil)
	if err != nil {
		log.Log.Error(err, "Failed to make Get Request instance")
		retErr = err
	}
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Log.Error(err, "Failed to get response from server")
		retErr = err
	}
	defer res.Body.Close()
	ipBytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Log.Error(err, "Failed to read response body")
		retErr = err
	}
	if len(ipBytes) > 0 {
		if err := json.Unmarshal(ipBytes, &ip); err != nil {
			log.Log.Error(err, "Failed to parse json")
			retErr = err
		}
	} else {
		retErr = typing.ErrEmptyResponse
	}
	ret <- HttpReturn{
		ip:  ip,
		err: retErr,
	}
}

func sendPutRequest(ret chan HttpReturn, ip IP) {
	var retErr error
	ipBytes, err := json.Marshal(ip)
	client := &http.Client{}
	if err != nil {
		log.Log.Error(err, "Failed to marshal ip")
		retErr = err
	}
	req, err := http.NewRequest(
		http.MethodPut,
		fmt.Sprintf("%s/%s", server, "ip"),
		bytes.NewBuffer(ipBytes))
	if err != nil {
		log.Log.Error(err, "Failed to make Put Request instance")
		retErr = err
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	res, err := client.Do(req)
	if err != nil {
		log.Log.Error(err, "Failed to get response from server")
		retErr = err
	}
	statusCode := res.StatusCode
	if statusCode == http.StatusBadRequest || statusCode == http.StatusInternalServerError ||
		statusCode == http.StatusServiceUnavailable {

		log.Log.Error(typing.ErrStatusCode,
			fmt.Sprintf("Failed to update ip status with code : %d", statusCode))
		retErr = typing.ErrStatusCode
	}
	ret <- HttpReturn{
		ip:  ip,
		err: retErr,
	}
}
