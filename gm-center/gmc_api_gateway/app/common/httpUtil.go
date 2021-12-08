package common

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"
	"io"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"github.com/go-resty/resty/v2"
)

var listTemplates = map[string]string{
	"pods":                "/api/v1/pods",
	"services":            "/api/v1/services",
	"endpoints":           "/api/v1/endpoints",
	"configmaps":          "/api/v1/configmaps",
	"serviceaccounts":     "/api/v1/serviceaccounts",
	"resourcequota":       "/api/v1/resourcequotas",
	"deployments":         "/apis/apps/v1/deployments",
	"replicasets":         "/apis/apps/v1/replicasets",
	"jobs":                "/apis/batch/v1/jobs",
	"cronjobs":            "/apis/batch/v1/cronjobs",
	"clusterroles":        "/apis/rbac.authorization.k8s.io/v1/clusterroles",
	"roles":               "/apis/rbac.authorization.k8s.io/v1/roles",
	"clusterrolebindings": "/apis/rbac.authorization.k8s.io/v1/clusterrolebindings",
	"namespaces":          "/api/v1/namespaces",
	"nodes":               "/api/v1/nodes",
	"events":              "/apis/events.k8s.io/v1/events",
}

var nsTemplates = map[string]string{
	"pods":                "/api/v1/namespaces/$1/pods/$2",
	"services":            "/api/v1/namespaces/$1/services/$2",
	"endpoints":           "/api/v1/namespaces/$1/endpoints/$2",
	"configmaps":          "/api/v1/namespaces/$1/configmaps/$2",
	"serviceaccounts":     "/api/v1/namespaces/$1/serviceaccounts/$2",
	"resourcequota":       "/api/v1/namespaces/$1/resourcequotas/$2",
	"deployments":         "/apis/apps/v1/namespaces/$1/deployments/$2",
	"replicasets":         "/apis/apps/v1/namespaces/$1/replicasets/$2",
	"jobs":                "/apis/batch/v1/namespaces/$1/jobs/$2",
	"cronjobs":            "/apis/batch/v1/namespaces/$1/cronjobs/$2",
	"clusterroles":        "/apis/rbac.authorization.k8s.io/v1/clusterroles/$2",
	"roles":               "/apis/rbac.authorization.k8s.io/v1/namespaces/$1/roles/$2",
	"clusterrolebindings": "/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/$2",
	"namespaces":          "/api/v1/namespaces/$2",
	"nodes":               "/api/v1/nodes/$2",
	"events":              "/apis/events.k8s.io/v1/namespaces/$1/events/$2",
}

var (
	SetPod                = new(model.Pod)
	SetService            = new(model.Service)
	SetEndpoint           = new(model.Endpoints)
	SetConfigmap          = new(model.ConfigMap)
	SetServiceaccount     = new(model.ServiceAccount)
	SetResourcequota      = new(model.ResourceQuota)
	SetDeployment         = new(model.Deployment)
	SetReplicaset         = new(model.ReplicaSet)
	SetJob                = new(model.Job)
	SetCronjob            = new(model.CronJob)
	SetClusterrole        = new(model.ClusterRole)
	SetRole               = new(model.Role)
	SetClusterrolebinding = new(model.ClusterRoleBinding)
	SetNamespace          = new(model.Namespace)
	SetNode               = new(model.Node)
	SetEvent              = new(model.Event)

	SetPods                = new(model.PodList)
	SetServices            = new(model.ServiceList)
	SetEndpoints           = new(model.EndpointsList)
	SetConfigmaps          = new(model.ConfigMapList)
	SetServiceaccounts     = new(model.ServiceAccountList)
	SetResourcequotas      = new(model.ResourceQuotaList)
	SetDeployments         = new(model.DeploymentList)
	SetReplicasets         = new(model.ReplicaSetList)
	SetJobs                = new(model.JobList)
	SetCronjobs            = new(model.CronJobList)
	SetClusterroles        = new(model.ClusterRoleList)
	SetRoles               = new(model.RoleList)
	SetClusterrolebindings = new(model.ClusterRoleBindingList)
	SetNamespaces          = new(model.NamespaceList)
	SetNodes               = new(model.NodeList)
	SetEvents              = new(model.EventList)
)

func DataRequest(params model.PARAMS) (data string, err error) {
	var endPoint, token_value string

	if err := validate(params); err != nil {
		return "", err
	}

	if data, err := FindClusterDB(params.Cluster); err != nil {
		return "", err
	} else {
		endPoint = data.Endpoint
		token_value = data.Token
	}

	url := UrlExpr(endPoint, params.Project, params.Name, params.Kind)

	log.Println("url is", url)

	switch url {
	case "noname":
		return "", ErrWorkspaceInvalid
	case "nodetail":
		return "", ErrDetailNameInvalid
	}

	log.Printf("[#31] url is %s", url)
	var responseString, token string
	reqMethod := params.Method
	// passBody := responseBody(params.Body)
	passBody := params.Body

	log.Printf("[#32] passBody is %s", passBody)
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

	return responseString, nil
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

func FindClusterDB(name string) (*model.Cluster, error) {
	log.Println("in FindClusterDB")
	db := db.DbManager()
	var models model.Cluster

	if err := db.First(&models, model.Cluster{Name: name}).Error; err != nil {
		return &models, err
	}
	return &models, nil
}

func UrlExpr(endpoint, project, item, kind string) string {
	check_project := strings.Compare(project, "") != 0
	check_item := strings.Compare(item, "") != 0

	defaultUrl := "https://" + endpoint + ":6443"
	var returnUrl string
	fmt.Printf("##### teststest : %v,%v \n", check_project, check_item)
	if check_project || check_item {
		// project or item value exist
		// if err := errCheck(project, item, kind); err != "" {
		// 	return err
		// }
		returnUrl = defaultUrl + ProjectExpr(nsTemplates[kind], project, item)
	} else {
		returnUrl = defaultUrl + listTemplates[kind]
	}

	return returnUrl
}

func ProjectExpr(url, project, item string) string {
	check_project := strings.Compare(project, "") != 0
	check_item := strings.Compare(item, "") != 0
	returnVal := url

	if check_project && check_item {
		returnVal = strings.Replace(returnVal, "$1", project, -1)
		returnVal = strings.Replace(returnVal, "$2", item, -1)
	} else if check_project {
		returnVal = strings.Replace(returnVal, "$1", project, -1)
		returnVal = strings.Replace(returnVal, "$2", "", -1)
	} else if check_item {
		returnVal = strings.Replace(returnVal, "$2", item, -1)
	}

	return returnVal
}

func errCheck(project, item, kind string) string {
	check_project := strings.Compare(project, "") != 0
	check_item := strings.Compare(item, "") != 0

	if !check_project {
		if strings.Compare(kind, "clusterroles") == 0 || strings.Compare(kind, "namespaces") == 0 || strings.Compare(kind, "nodes") == 0 {
			if !check_item {
				return "nodetail"
			}
		} else {
			if !check_project {
				return "noname"
			}
		}
	}

	return ""
}

func validate(params model.PARAMS) error {
	workspaceCheck := strings.Compare(params.Workspace, "") != 0
	clusterCheck := strings.Compare(params.Cluster, "") != 0
	projectCheck := strings.Compare(params.Project, "") != 0
	nameCheck := strings.Compare(params.Name, "") != 0

	Method := params.Method
	// Body := responseBody(params.Body)
	Body := params.Body
	BodyCheck := strings.Compare(Body, "") != 0

	if Method == "POST" {
		if !BodyCheck {
			return ErrBodyEmpty
		}
		if !clusterCheck {
			return ErrClusterInvalid
		}
		if !projectCheck {
			return ErrProjectInvalid
		}
	} else if Method == "DELETE" {
		if !clusterCheck {
			return ErrClusterInvalid
		}
		if !projectCheck {
			return ErrProjectInvalid
		}
		if !nameCheck {
			return ErrDetailNameInvalid
		}
	} else if Method == "GET" {
		// if !clusterCheck {
		// 	return ErrClusterInvalid
		// }
	} else {
		if !clusterCheck {
			return ErrClusterInvalid
		}
		if !workspaceCheck {
			return ErrWorkspaceInvalid
		}
	}

	return nil
}
