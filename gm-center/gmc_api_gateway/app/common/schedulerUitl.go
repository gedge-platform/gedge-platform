package common

import (
	"bytes"
	"crypto/tls"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"
 "fmt"
	"gmc_api_gateway/app/model"

	"github.com/go-resty/resty/v2"
)

// var listTemplates_spider = map[string]string{
// 	"cloudos":          "/spider/cloudos",
// 	"credential":       "/spider/credential",
// 	"connectionconfig": "/spider/connectionconfig",
// 	"clouddriver":      "/spider/driver",
// 	"cloudregion":      "/spider/region",
// 	"vm":               "/spider/vm",
// 	"controlvm":        "/spider/controlvm",
// 	"vmstatus":         "/spider/vmstatus",
// 	"vmspec":           "/spider/vmspec",
// 	"vmorgspec":        "/spider/vmorgspec",
// 	"vmimage":          "/spider/vmimage",
// 	"vpc":              "/spider/vpc",
// 	"securitygroup":    "/spider/securitygroup",
// 	"regsecuritygroup": "/spider/regsecuritygroup",
// 	"keypair":          "/spider/keypair",
// 	"regkeypair":       "/spider/regkeypair",
// // }

// var nsTemplates_spider = map[string]string{
// 	"credential": "/gmcapi/v2/spider/$1",
// }

func DataRequest_scheduler(params model.PARAMS) (data string, err error) {

	var endPoint, token_value string
	// config := config.GetConfig()s
	endPoint = os.Getenv("GS_SCHEDULER")

	url := endPoint + "?" + params.QueryString
	log.Println("url is", url)
	log.Println("body is", params.Body)

	// log.Printf("[#31] url is %s", url)
	var responseString, token string
	r := io.NopCloser(strings.NewReader(params.Body))
	reqMethod := params.Method
	passBody := ResponseBody_scheduler(r)
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
			log.Println("test err: ", err)
			err = err
		} else {
			log.Println("test resp: ", resp)
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

	return responseString, err
}

func DataRequest_Loki(endPoint string, query string, params model.PARAMS) (data string, err error) {
	var responseString string
	lokiURL := "http://" + endPoint + ":31603/loki/api/v1/query_range"
	// Resty 클라이언트를 생성합니다.
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
	// 예제로 Log를 쿼리하는 API 호출을 수행합니다.
	// query := "loki{job=\"example\"}"
	response, err := client.R().
		SetQueryParams(map[string]string{
			"query": query,
		}).
		Get(lokiURL)

	if err != nil {
		log.Fatalf("Error making request: %v", err)
	}
	if response.StatusCode() == 200 {
		// fmt.Println("Response Body:", response.String())
		responseString = response.String()
	
	} else {
		fmt.Println("API request failed with status code:", response.StatusCode())
	}

	// var token_value string
	// // config := config.GetConfig()s
	// // endPoint = os.Getenv("GS_SCHEDULER")

	// url := "http://" + endPoint + ":31603/loki/api/v1/query_range?query=" + query
	// log.Println("url is", url)
	// log.Println("body is", params.Body)

	// // log.Printf("[#31] url is %s", url)
	// var responseString, token string
	// r := io.NopCloser(strings.NewReader(params.Body))
	// reqMethod := params.Method
	// passBody := ResponseBody_scheduler(r) 
	// //passBody := params.Body

	// //body := ResponseBody(_body)

	// // log.Printf("[#32] passBody is %s", passBody)
	// token = token_value

	// client := resty.New()
	// client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	// client.SetTimeout(2 * time.Minute)
	// client.SetHeaders(map[string]string{
	// 	"Access-Control-Allow-Origin": "*",
	// 	"Content-Type":                "application/json; charset=utf-8",
	// 	"Accept":                      "application/json; charset=utf-8",
	// })
	// client.SetAllowGetMethodPayload(true)
	// client.SetDebug(true)
	// switch reqMethod {
	// case "GET":
	// 	if resp, err := client.R().SetBody([]byte(params.Body)).Get(url); err != nil || string(resp.Body()) =="400 Bad Request" {
	// 		log.Println("err : ", err)
	// 		err = string(resp.Body())
	// 	} else {
	// 			responseString = string(resp.Body())
	// 	}
	// case "POST":
	// 	if resp, err := client.R().SetBody([]byte(string(passBody))).
	// 		SetAuthToken(token).
	// 		Post(url); err != nil {

	// 		// panic(err)
	// 		log.Println("test err: ", err)
	// 		err = err
	// 	} else {
	// 		log.Println("test resp: ", resp)
	// 		responseString = string(resp.Body())
	// 	}

	// case "PATCH":
	// 	if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Patch(url); err != nil {
	// 		// panic(err)
	// 	} else {
	// 		responseString = string(resp.Body())
	// 	}
	// case "PUT":
	// 	if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Put(url); err != nil {
	// 		// panic(err)
	// 	} else {
	// 		responseString = string(resp.Body())
	// 	}
	// case "DELETE":
	// 	if resp, err := client.R().SetAuthToken(token).SetBody([]byte(params.Body)).Delete(url); err != nil {
	// 		// panic(err)
	// 	} else {
	// 		responseString = string(resp.Body())
	// 	}
	// }
	return responseString, err
	
}

func ResponseBody_scheduler(req io.ReadCloser) string {
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
func UrlExpr_scheduler(endpoint, item, kind string, action string) string {
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
