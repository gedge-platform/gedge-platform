package common

import (
	"bytes"
	"crypto/tls"
	"io"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"gmc_api_gateway/app/model"
	"gmc_api_gateway/config"

	"github.com/go-resty/resty/v2"
)

var listTemplates_spider = map[string]string{
	"cloudos":          "/spider/cloudos",
	"credential":       "/spider/credential",
	"connectionconfig": "/spider/connectionconfig",
	"clouddriver":      "/spider/driver",
	"cloudregion":      "/spider/region",
	"vm":               "/spider/vm",
	"controlvm":        "/spider/controlvm",
	"vmstatus":         "/spider/vmstatus",
	"vmspec":           "/spider/vmspec",
	"vmorgspec":        "/spider/vmorgspec",
	"vmimage":          "/spider/vmimage",
	"vpc":              "/spider/vpc",
	"securitygroup":    "/spider/securitygroup",
	"regsecuritygroup": "/spider/regsecuritygroup",
	"keypair":          "/spider/keypair",
	"regkeypair":       "/spider/regkeypair",
}

var nsTemplates_spider = map[string]string{
	"credential": "/gmcapi/v2/spider/$1",
}

func DataRequest_spider(params model.PARAMS) (data string, err error) {
	var endPoint, token_value string
	config := config.GetConfig()

	endPoint = config.URL.Spider

	// log.Printf("[#endPoint] is %s", endPoint)

	// log.Printf("[#params.Name] is %s", params.Name)
	// log.Printf("[#params.Kind] is %s", params.Kind)
	// log.Printf("[#params.Action] is %s", params.Action)
	// log.Printf("[#params.Body] is %s", params.Body)
	// log.Printf("[#############]")

	url := UrlExpr_spider(endPoint, params.Name, params.Kind, params.Action)

	log.Println("url is", url)

	switch url {
	case "noname":
		return "", ErrWorkspaceInvalid
	case "nodetail":
		return "", ErrDetailNameInvalid
	}

	// log.Printf("[#31] url is %s", url)
	var responseString, token string
	r := io.NopCloser(strings.NewReader(params.Body))
	reqMethod := params.Method
	passBody := ResponseBody_spider(r)
	//passBody := params.Body

	//body := ResponseBody(_body)

	// log.Printf("[#32] passBody is %s", passBody)
	token = token_value

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	client.SetTimeout(2 * time.Minute)
	client.SetHeaders(map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json; charset=utf-8",
		"Accept":                      "application/json; charset=utf-8",
	})
	client.SetAllowGetMethodPayload(true)
	client.SetDebug(true)

	switch reqMethod {
	case "GET":
		if resp, err := client.R().SetBody([]byte(params.Body)).Get(url); err != nil {
			// panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "POST":
		if resp, err := client.R().SetBody([]byte(string(passBody))).
			SetAuthToken(token).
			Post(url); err != nil {
			// panic(err)
		} else {
			responseString = string(resp.Body())

		}

	case "PATCH":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Patch(url); err != nil {
			// panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PUT":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Put(url); err != nil {
			// panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "DELETE":
		if resp, err := client.R().SetAuthToken(token).SetBody([]byte(params.Body)).Delete(url); err != nil {
			// panic(err)
		} else {
			responseString = string(resp.Body())
		}
	}

	return responseString, nil
}

func ResponseBody_spider(req io.ReadCloser) string {
	var bodyBytes []byte
	if req != nil {
		bodyBytes, _ = ioutil.ReadAll(req)
	}

	// Restore the io.ReadCloser to its original state
	req = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
	buf := new(bytes.Buffer)
	buf.ReadFrom(req)
	newStr := buf.String()

	return newStr
}
func UrlExpr_spider(endpoint, item, kind string, action string) string {
	check_item := strings.Compare(item, "") != 0
	check_action := strings.Compare(action, "") != 0
	var returnUrl string
	defaultUrl := "http://" + endpoint + ":1024"

	if check_item {
		if check_action {
			returnUrl = defaultUrl + listTemplates_spider[kind] + "/" + item + "?action=" + action
		} else {
			returnUrl = defaultUrl + listTemplates_spider[kind] + "/" + item
		}
	} else {
		returnUrl = defaultUrl + listTemplates_spider[kind]
	}

	return returnUrl

}
