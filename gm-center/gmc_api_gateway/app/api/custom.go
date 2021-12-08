package api

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"

	"github.com/go-resty/resty/v2"
	"github.com/labstack/echo/v4"
	"github.com/tidwall/gjson"
)

func Kubernetes(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("cluster_name")
	if models := FindClusterDB(db, "Name", search_val); models == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return
	}

	url := GetClusterEP(c)
	if url == "" {
		return nil
	} else if _, err := HttpRequest(c, url, true); err != nil {
		log.Println("HttpRequest error")
	}

	return nil
}

func GetClusterEP(c echo.Context) (url string) {
	kind_name := c.Param("kind_name")
	namespace_name := c.Param("namespace_name")
	detailUrl := getDetailURL(c)

	var returnUrl, returnUrl2 string

	switch detailUrl {
	case "pods_deploylist":
		returnUrl2 = getURL(c, "pods")
	case "pods_eventlist":
		returnUrl2 = getURL(c, "pods")
	case "jobs_podlist":
		returnUrl2 = getURL(c, "pods")
	case "jobs_eventlist":
		returnUrl2 = getURL(c, "jobs")
	case "cronjobs_joblist":
		returnUrl2 = getURL(c, "jobs")
	case "deployments_list":
		returnUrl2 = getURL(c, "replicasets")
	case "services_list":
		returnUrl2 = getURL(c, "endpoints")
	}

	if kind_name == "application_resource" || namespace_name == "application_resource" {
		applicationResource(c)
		return ""
	} else {
		returnUrl = getURL(c, kind_name)
	}

	switch c.Param("*") {
	case "":
		returnUrl = returnUrl + c.Param("*")
	case "\n":
		returnUrl = returnUrl + c.Param("*")
	default:
		returnUrl = returnUrl + "/" + c.Param("*")
	}

	switch detailUrl {
	case "pods_deploylist":
		returnUrl = strings.TrimRight(returnUrl, "list")
		returnUrl = strings.TrimRight(returnUrl, "/")
	case "pods_eventlist":
		returnUrl = strings.TrimRight(returnUrl, "events")
		returnUrl = strings.TrimRight(returnUrl, "/")
	case "jobs_podlist":
		returnUrl = strings.TrimRight(returnUrl, "list")
		returnUrl = strings.TrimRight(returnUrl, "/")
	case "jobs_eventlist":
		returnUrl = strings.TrimRight(returnUrl, "events")
		returnUrl = strings.TrimRight(returnUrl, "/")
	case "cronjobs_joblist":
		returnUrl = strings.TrimRight(returnUrl, "list")
		returnUrl = strings.TrimRight(returnUrl, "/")
	case "deployments_list":
		returnUrl = strings.TrimRight(returnUrl, "list")
		returnUrl = strings.TrimRight(returnUrl, "/")
	case "services_list":
		returnUrl = strings.TrimRight(returnUrl, "list")
		returnUrl = strings.TrimRight(returnUrl, "/")
	}

	switch detailUrl {
	case "pods_deploylist":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.generateName").String()
			if Uniq == "" {
				log.Printf("Not Found")
				return "nf"
			}
			Uniq = strings.TrimRight(Uniq, "-")
			url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq)
			switch url {
			case "nf":
				return returnUrl
			case "em":
				return ""
			default:
				return url
			}
		}
	case "pods_eventlist":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.uid")
			url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq.String())
			switch url {
			case "nf":
				return returnUrl
			case "em":
				return ""
			default:
				return url
			}
		}
	case "jobs_podlist":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.labels.job-name")
			if url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq.String()); url == "nf" {
				return returnUrl
			} else {
				return url
			}
		}
	case "jobs_eventlist":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.uid")
			url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq.String())
			switch url {
			case "nf":
				return returnUrl
			case "em":
				return ""
			default:
				return url
			}
		}
	case "cronjobs_joblist":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.uid")
			url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq.String())
			switch url {
			case "nf":
				return returnUrl
			case "em":
				return ""
			default:
				return url
			}
		}
	case "deployments_list":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.uid")
			url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq.String())
			switch url {
			case "nf":
				return returnUrl
			case "em":
				return ""
			default:
				return url
			}
		}
	case "services_list":
		if data, err := HttpRequest(c, returnUrl, false); err != nil {
			log.Println("HttpRequest error")
			return returnUrl
		} else {
			Uniq := gjson.Get(data, "metadata.name")
			url, _ := getDetailList(c, detailUrl, returnUrl2, Uniq.String())
			switch url {
			case "nf":
				return returnUrl
			case "em":
				return ""
			default:
				return url
			}
		}
	}

	return returnUrl
}

func GetKindURL(kindParam string) (url string, kind string) {
	var kindUrl string
	log.Printf("kindParam is %s", kindParam)
	if kindParam == "deployments" {
		kindUrl = "apis/apps/v1/namespaces/"
	} else if kindParam == "deploymentsAll" {
		kindUrl = "apis/apps/v1/"
	} else if kindParam == "replicasets" {
		kindUrl = "apis/apps/v1/namespaces/"
	} else if kindParam == "replicasetsAll" {
		kindUrl = "apis/apps/v1/"
	} else if kindParam == "jobs" {
		kindUrl = "apis/batch/v1/namespaces/"
	} else if kindParam == "jobsAll" {
		kindUrl = "apis/batch/v1/"
	} else if kindParam == "cronjobs" {
		kindUrl = "apis/batch/v1/namespaces/"
	} else if kindParam == "cronjobsAll" {
		kindUrl = "apis/batch/v1/"
	} else if kindParam == "clusterroles" || kindParam == "roles" || kindParam == "clusterrolebindings" {
		kindUrl = "apis/rbac.authorization.k8s.io/v1/namespaces/"
	} else if kindParam == "clusterrolesAll" || kindParam == "rolesAll" || kindParam == "clusterrolebindingsAll" {
		kindUrl = "apis/rbac.authorization.k8s.io/v1/"
	} else if kindParam == "networkpolicies" {
		kindUrl = "apis/networking.k8s.io/v1/namespaces/"
	} else if kindParam == "networkpoliciesAll" {
		kindUrl = "apis/networking.k8s.io/v1/"
	} else if kindParam == "namespaces" {
		kindUrl = "api/v1/namespaces/"
	} else if kindParam == "nodes" {
		kindUrl = "api/v1/"
	} else if kindParam == "events" {
		kindUrl = "apis/events.k8s.io/v1/namespaces/"
	} else if kindParam == "\n" || kindParam == "" {
		kindUrl = "api/v1/"
	} else {
		kindUrl = "api/v1/namespaces/"
	}

	return kindUrl, kindParam
}

func GetNamespaceURL(namespaceParam string) (url string) {
	var namespaceUrl string

	switch namespaceUrl {
	case "":
		namespaceUrl = namespaceParam + "/"
	case "\n":
		namespaceUrl = namespaceParam + "/"
	case "default":
		namespaceUrl = namespaceParam + "/"
	default:
		namespaceUrl = namespaceParam + "/"
	}

	return namespaceUrl
}

func getDetailURL(c echo.Context) (value string) {
	var multiParamChk []string
	var multiParamLen int
	// var SearchVal string

	multiParamChk = strings.Split(c.Param("*"), "/")
	multiParamLen = len(multiParamChk)
	kind_name := c.Param("kind_name")

	if multiParamLen >= 2 {
		switch kind_name {
		case "pods":
			log.Printf("check Param : " + multiParamChk[1])
			if multiParamChk[1] == "list" {
				value = "pods_deploylist"
				return value
			} else if multiParamChk[1] == "events" {
				value = "pods_eventlist"
				return value
			}
		case "jobs":
			log.Printf("check Param : " + multiParamChk[1])
			if multiParamChk[1] == "list" {
				value = "jobs_podlist"
				return value
			} else if multiParamChk[1] == "events" {
				value = "jobs_eventlist"
				return value
			}
		case "cronjobs":
			log.Printf("check Param : " + multiParamChk[1])
			if multiParamChk[1] == "list" {
				value = "cronjobs_joblist"
				return value
			}
		case "deployments":
			log.Printf("check Param : " + multiParamChk[1])
			if multiParamChk[1] == "list" {
				value = "deployments_list"
				return value
			}
		case "services":
			log.Printf("check Param : " + multiParamChk[1])
			if multiParamChk[1] == "list" {
				value = "services_list"
				return value
			}
		default:
			return "nf"
		}

	}
	return "nf"
}
func HttpRequest2(c echo.Context, url string, check bool) (data string, err error) {
	var responseString, token, token_value string

	db := db.DbManager()
	if models := FindClusterDB(db, "Name", c.QueryParam("cluster")); models == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return
	} else {
		token_value = models.Token
	}

	reqMethod := c.Request().Method
	passBody := responseBody(c.Request().Body)
	// auth := strings.SplitN(c.Request().Header["Authorization"], " ", 2)
	tokens, ok := c.Request().Header["Authorization"]
	fmt.Printf("tokens : %s\n", tokens)
	// tokens, ok := c.Request().Header["Authorization"]
	// if ok && len(tokens) >= 1 {
	// 	token = tokens[0]
	// 	token = strings.TrimPrefix(token, "Bearer ")
	// }

	token = token_value

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	client.SetTimeout(1 * time.Minute)
	client.SetHeaders(map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json; charset=utf-8",
		"Accept":                      "application/json; charset=utf-8",
	})

	switch reqMethod {
	case "GET":
		if resp, err := client.R().SetAuthToken(token).Get(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "POST":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Post(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PATCH":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Patch(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PUT":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Put(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "DELETE":
		if resp, err := client.R().SetAuthToken(token).Delete(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	}

	content, ok := gjson.Parse(responseString).Value().(map[string]interface{})
	if !ok {
		panic("err")
	}

	if check == true {
		return responseString, c.JSON(http.StatusOK, content)
	} else {
		return responseString, nil
	}
}
func HttpRequest(c echo.Context, url string, check bool) (data string, err error) {
	var responseString, token, token_value string

	db := db.DbManager()
	if models := FindClusterDB(db, "Name", c.Param("cluster_name")); models == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return
	} else {
		token_value = models.Token
	}

	reqMethod := c.Request().Method
	passBody := responseBody(c.Request().Body)
	// auth := strings.SplitN(c.Request().Header["Authorization"], " ", 2)
	tokens, ok := c.Request().Header["Authorization"]
	fmt.Printf("tokens : %s\n", tokens)
	// tokens, ok := c.Request().Header["Authorization"]
	// if ok && len(tokens) >= 1 {
	// 	token = tokens[0]
	// 	token = strings.TrimPrefix(token, "Bearer ")
	// }

	token = token_value

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	client.SetTimeout(1 * time.Minute)
	client.SetHeaders(map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json; charset=utf-8",
		"Accept":                      "application/json; charset=utf-8",
	})

	switch reqMethod {
	case "GET":
		if resp, err := client.R().SetAuthToken(token).Get(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "POST":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Post(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PATCH":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Patch(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PUT":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Put(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "DELETE":
		if resp, err := client.R().SetAuthToken(token).Delete(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	}

	content, ok := gjson.Parse(responseString).Value().(map[string]interface{})
	if !ok {
		panic("err")
	}

	if check == true {
		return responseString, c.JSON(http.StatusOK, content)
	} else {
		return responseString, nil
	}
}

func HttpRequest3(c echo.Context, url string, check bool) (data string, err error) {
	var responseString, token, token_value string

	db := db.DbManager()
	if models := FindClusterDB(db, "Name", c.QueryParam("cluster")); models == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return
	} else {
		token_value = models.Token
	}

	reqMethod := c.Request().Method
	passBody := responseBody(c.Request().Body)

	// tokens, ok := c.Request().Header["Authorization"]
	// if ok && len(tokens) >= 1 {
	// 	token = tokens[0]
	// 	token = strings.TrimPrefix(token, "Bearer ")
	// }

	token = token_value

	client := resty.New()
	client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	client.SetTimeout(1 * time.Minute)
	client.SetHeaders(map[string]string{
		"Access-Control-Allow-Origin": "*",
		"Content-Type":                "application/json; charset=utf-8",
		"Accept":                      "application/json; charset=utf-8",
	})

	switch reqMethod {
	case "GET":
		if resp, err := client.R().SetAuthToken(token).Get(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "POST":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Post(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PATCH":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Patch(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "PUT":
		if resp, err := client.R().SetBody([]byte(string(passBody))).SetAuthToken(token).Put(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	case "DELETE":
		if resp, err := client.R().SetAuthToken(token).Delete(url); err != nil {
			panic(err)
		} else {
			responseString = string(resp.Body())
		}
	}

	content, ok := gjson.Parse(responseString).Value().(map[string]interface{})
	if !ok {
		panic("err")
	}

	if check == true {
		return responseString, c.JSON(http.StatusOK, content)
	} else {
		return responseString, nil
	}
}

func lastString(ss []string) string {
	return ss[len(ss)-1]
}

func responseBody(req io.ReadCloser) string {
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

func getDetailList(c echo.Context, kind string, url string, uniq string) (urls string, err error) {

	jobList := []model.Job{}
	jobOnly := model.Job{}
	podList := []model.Pod{}
	svcList := []model.Service{}
	eventList := []model.Event{}
	endpointSubsetList := []model.EndpointSubset{}
	DeployOnly := model.Deployment{}

	log.Printf("###getDetailURL Start###")
	log.Printf("val is %s", uniq)
	log.Printf("url is %s", url)
	if data := getData(c, url, false); data != "nf" {
		if uniq == "" || uniq == "\n" {
			return "nf", nil
		}

		switch kind {
		case "pods_deploylist":
			var returnUrl string
			var returnVal string
			if url, result := getDeployment(c, "replicasets", uniq); result != "nf" {
				returnUrl = url
				returnVal = result
			} else {
				return "nf", nil
			}

			url = returnUrl + "/" + returnVal
			log.Printf("#45 - %s", url)
			return url, nil

		case "pods_eventlist":
			eventList = getEvents(c, "events", uniq)
			return "em", c.JSON(http.StatusOK, echo.Map{"items": eventList})

		case "jobs_podlist":
			var returnVal string
			result := gjson.Get(data, `items.#.metadata.name`)
			for _, name := range result.Array() {
				if strings.Contains(name.String(), uniq) == true {
					returnVal = name.String()
				}
			}

			url = url + "/" + returnVal
			return url, nil

		case "jobs_eventlist":
			eventList = getEvents(c, "events", uniq)
			return "em", c.JSON(http.StatusOK, echo.Map{"items": eventList})

		case "cronjobs_joblist":
			k := gjson.Get(data, "items").Array()
			for t, _ := range k {
				arr := k[t].Get("metadata.ownerReferences").Array()
				if len(arr) > 0 {
					for t2, _ := range arr {
						if strings.Contains(arr[t2].Get("kind").String(), "CronJob") == true && strings.Contains(arr[t2].Get("uid").String(), uniq) == true {
							err := json.Unmarshal([]byte(k[t].String()), &jobOnly)
							if err != nil {
								panic(err)
							}
							jobList = append(jobList, jobOnly)
						}
					}
				}
			}

			return "em", c.JSON(http.StatusOK, echo.Map{"items": jobList})

		case "deployments_list":
			k := gjson.Get(data, "items").Array()
			for t, _ := range k {
				arr := k[t].Get("metadata.ownerReferences").Array()
				if len(arr) > 0 {
					for t2, _ := range arr {
						if arr[t2].Get("kind").String() == "Deployment" && arr[t2].Get("uid").String() == uniq {
							podList = getPods(c, "pods", k[t].Get("metadata").Get("uid").String())
							svcList = getServices(c, "services", k[t].Get(`spec.selector.matchLabels.app`).String())
						}
					}
				}
			}

			return "em", c.JSON(http.StatusOK, echo.Map{
				"pods":     podList,
				"services": svcList,
			})

		case "services_list":
			k := gjson.Get(data, "items").Array()
			result := gjson.Get(data, `items.#.metadata.name`)
			for n, name := range result.Array() {
				if strings.Contains(name.String(), uniq) == true {
					result2 := gjson.Get(k[n].String(), `subsets`)
					err := json.Unmarshal([]byte(result2.String()), &endpointSubsetList)
					if err != nil {
						panic(err)
					}
					for _, name2 := range result2.Array() {
						result3 := gjson.Get(name2.String(), `addresses`)
						for _, name3 := range result3.Array() {
							if strings.Contains(name3.Get("targetRef.kind").String(), "Pod") == true {
								uid := name3.Get("targetRef.uid").String()
								url := getURL(c, "pods")
								if data := getData(c, url, false); data != "nf" {
									n := gjson.Parse(data)
									k := n.Get("items.#.metadata").Array()
									for t, _ := range k {
										if k[t].Get(`uid`).String() == uid {
											k2 := k[t].Get(`ownerReferences`).Array()
											for t2, _ := range k2 {
												if k2[t2].Get(`kind`).String() == "ReplicaSet" {
													Uniq := k2[t2].Get(`name`).String()
													Uniq = strings.TrimRight(Uniq, "-")
													var returnUrl string
													var returnVal string
													if url, result := getDeployment(c, "replicasets", Uniq); result != "nf" {
														returnUrl = url
														returnVal = result
													} else {
														log.Println("bb no")
													}
													url = returnUrl + "/" + returnVal
													if data := getData(c, url, false); data != "nf" {
														err := json.Unmarshal([]byte(data), &DeployOnly)
														if err != nil {
															panic(err)
														}
													}
												}
											}
										}
									}
								}
							}

						}
					}
				}
			}
			return "em", c.JSON(http.StatusOK, echo.Map{
				"pods":        endpointSubsetList,
				"deployments": DeployOnly,
			})
		}
	}

	return "nf", nil
}

func getData(c echo.Context, url string, check bool) string {

	if data, err := HttpRequest(c, url, check); err != nil {
		log.Println("HttpRequest error")
		return "nf"
	} else {
		return data
	}
}

func getPods(c echo.Context, kind string, uniq string) []model.Pod {

	List := []model.Pod{}
	Only := model.Pod{}
	url := getURL(c, kind)

	if data := getData(c, url, false); data != "nf" {
		n := gjson.Parse(data)
		k := n.Get("items").Array()
		for t, _ := range k {
			t2 := k[t].Get("metadata").Get("ownerReferences").Array()
			if len(t2) > 0 {
				for t3, _ := range t2 {
					if t2[t3].Get("kind").String() == "ReplicaSet" && t2[t3].Get("uid").String() == uniq {
						err := json.Unmarshal([]byte(k[t].String()), &Only)
						if err != nil {
							panic(err)
						}
						List = append(List, Only)
					}
				}
			}
		}
	}
	return List
}

func getEndpoints(c echo.Context, kind string, uniq string) []model.Endpoints {

	List := []model.Endpoints{}
	Only := model.Endpoints{}
	url := getURL(c, kind)

	if data := getData(c, url, false); data != "nf" {
		n := gjson.Parse(data)
		k := n.Get("items").Array()
		for t, _ := range k {
			t2 := k[t].Get("metadata").Get("ownerReferences").Array()
			if len(t2) > 0 {
				for t3, _ := range t2 {
					if t2[t3].Get("kind").String() == "ReplicaSet" && t2[t3].Get("uid").String() == uniq {
						err := json.Unmarshal([]byte(k[t].String()), &Only)
						if err != nil {
							panic(err)
						}
						List = append(List, Only)
					}
				}
			}
		}
	}
	return List
}

func getServices(c echo.Context, kind string, uniq string) []model.Service {

	List := []model.Service{}
	Only := model.Service{}
	url := getURL(c, kind)

	if data := getData(c, url, false); data != "nf" {
		n := gjson.Parse(data)
		k := n.Get("items").Array()
		for t, _ := range k {
			if k[t].Get(`spec.selector.app`).String() == uniq {
				err := json.Unmarshal([]byte(k[t].String()), &Only)
				if err != nil {
					panic(err)
				}
				List = append(List, Only)
			}
		}
	}
	return List
}

func getDeployment(c echo.Context, kind string, uniq string) (string, string) {

	log.Printf("[#r4] In")

	url := getURL(c, kind)
	url = url + "/" + uniq

	log.Printf("url is %s", url)

	if data := getData(c, url, false); data != "nf" {
		n := gjson.Parse(data)
		k := n.Get("metadata.ownerReferences").Array()
		for t, _ := range k {
			if k[t].Get(`kind`).String() == "Deployment" {
				url := getURL(c, "deployments")
				return url, k[t].Get(`name`).String()
			}
		}
	}
	return "", "nf"
}

func getEvents(c echo.Context, kind string, uniq string) []model.Event {

	List := []model.Event{}
	Only := model.Event{}
	url := getURL(c, kind)

	log.Printf("[#43] %s", url)

	if data := getData(c, url, false); data != "nf" {
		n := gjson.Parse(data)
		k := n.Get("items").Array()
		// log.Printf("[#44] %s", k)
		for t, _ := range k {
			if k[t].Get(`regarding.uid`).String() == uniq {
				log.Printf("same uid %s is %s", k[t].Get(`regarding.uid`).String(), uniq)
				log.Printf("[#45] %s", k[t])
				err := json.Unmarshal([]byte(k[t].String()), &Only)
				if err != nil {
					panic(err)
				}
				List = append(List, Only)
			}
		}
	}
	return List
}

func getURL(c echo.Context, kind string) string {
	db := db.DbManager()
	namespace_name := c.Param("namespace_name")
	models := FindClusterDB(db, "Name", c.Param("cluster_name"))
	if models == nil {
		panic(models)
	}
	log.Printf("kind is %s", kind)
	log.Printf("namespace is %s", c.Param("namespace_name"))

	if c.Param("namespace_name") == "application_resource" {
		namespace_name = kind
		log.Printf("namespace_name is %s", namespace_name)
	}

	switch namespace_name {
	case "nodes":
		kind = "nodes"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "namespaces":
		kind = "namespaces"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + c.Param("kind_name")
		log.Println(url)
		return url
	case "networkpolicies":
		kind = "networkpoliciesAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "cronjobs":
		kind = "cronjobsAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "jobs":
		kind = "jobsAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "deployments":
		kind = "deploymentsAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "replicasets":
		kind = "replicasetsAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "clusterroles":
		kind = "clusterrolesAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "roles":
		kind = "rolesAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	case "clusterrolebindings":
		kind = "clusterrolebindingsAll"
		kindUrl, _ := GetKindURL(kind)
		url := "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + c.Param("kind_name")
		log.Println(url)
		return url
	default:
		kindUrl, kindName := GetKindURL(kind)
		url := ""
		if c.Param("namespace_name") == "application_resource" {
			url = "https://" + models.Endpoint + ":6443/" + "api/v1/" + namespace_name
		} else {
			url = "https://" + models.Endpoint + ":6443/" + kindUrl + GetNamespaceURL(namespace_name) + kindName
		}
		log.Println(url)
		return url
	}
}

func applicationResource(c echo.Context) error {
	cluster_name := c.Param("cluster_name")
	namespace_name := c.Param("namespace_name")

	var nodes, namespaces, pods, deployments, services, endpoints, jobs, cronjobs int

	log.Printf("[#63] cluster : %s, namespace : %s", cluster_name, namespace_name)

	nodes = len(gjson.Parse(getData(c, getURL(c, "nodes"), false)).Get("items").Array())
	namespaces = len(gjson.Parse(getData(c, getURL(c, "namespaces"), false)).Get("items").Array())
	pods = len(gjson.Parse(getData(c, getURL(c, "pods"), false)).Get("items").Array())
	deployments = len(gjson.Parse(getData(c, getURL(c, "deployments"), false)).Get("items").Array())
	services = len(gjson.Parse(getData(c, getURL(c, "services"), false)).Get("items").Array())
	endpoints = len(gjson.Parse(getData(c, getURL(c, "endpoints"), false)).Get("items").Array())
	jobs = len(gjson.Parse(getData(c, getURL(c, "jobs"), false)).Get("items").Array())
	cronjobs = len(gjson.Parse(getData(c, getURL(c, "cronjobs"), false)).Get("items").Array())

	return c.JSON(http.StatusOK, echo.Map{
		"count": echo.Map{
			"cluster_name":     cluster_name,
			"node_count":       nodes,
			"namespace_count":  namespaces,
			"pod_count":        pods,
			"deployment_count": deployments,
			"service_count":    services,
			"endpoint_count":   endpoints,
			"job_count":        jobs,
			"cronjob_count":    cronjobs,
		},
	})
}
