package api

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetAccount(c echo.Context) (err error) {
	db := db.DbManager()
	models := []model.Project{}
	db.Find(&models)

	if db.Find(&models).RowsAffected == 0 {
		common.ErrorMsg(c, http.StatusOK, common.ErrNoData)
		return
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func ClusterTest(c echo.Context) (err error) {
	pod_name := c.Param("name")
	workspace_name := c.QueryParam("workspace")
	project_name := c.QueryParam("project")
	cluster_name := c.QueryParam("cluster")

	fmt.Printf("cronjob_name is %s\n, workspace name is %s\n, project name is %s, cluster name is %s", pod_name, workspace_name, project_name, cluster_name)

	params := model.PARAMS{
		Kind:      "serviceaccounts",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}

	// data, err := common.GetModel(c, "serviceaccounts")
	getData, err := common.DataRequest(params)

	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	fmt.Printf("[#55555]data is info %s", getData)

	return nil
}

// func CreateAccount(c echo.Context) (err error) {

// 	// binding body data
// 	params := make(map[string]string)
// 	_ = c.Bind(&params)

// 	//get parameter
// 	user := params["user"]
// 	cluster := params["cluster"]
// 	namespace := params["namespace"]

// 	// cluster name & token search
// 	db := db.DbManager()
// 	// search_val := c.Param("name")
// 	models := FindClusterTokenDB(db, "Name", cluster)

// 	if models == nil {
// 		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
// 	}

// 	// create service account
// 	if CreateServiceAccount(user, namespace, models) == false {
// 		return c.JSON(http.StatusBadRequest, "service account create fail")
// 	}

// 	// create role
// 	if CreateRole(user, namespace, models) == false {
// 		return c.JSON(http.StatusBadRequest, "role create fail")
// 	}

// 	// create role binding
// 	if CreateRoleBinding(user, namespace, models) == false {
// 		return c.JSON(http.StatusBadRequest, "rolebinding create fail")
// 	}

// 	// get token of user namespaces
// 	token := GetProjectToken(user, namespace, models)

// 	println(token)

// 	//return c.JSON(http.StatusOK, "data")

// 	return c.JSON(http.StatusCreated, "create service account")

// }

// func CreateServiceAccount(name string, namespace string, models *model.ClusterToken) bool {
// 	// create service account
// 	accounts := model.Account{}

// 	accounts.Metadata.Name = name
// 	accounts.Metadata.Namespace = namespace

// 	url := "https://" + models.Endpoint + ":6443/api/v1/namespaces/" + namespace + "/serviceaccounts"

// 	data, err := json.Marshal(accounts)
// 	if err != nil {
// 		fmt.Println(err)
// 		return false
// 	}

// 	var jsonStr = []byte(fmt.Sprint(string(data)))

// 	code, _ := RequsetKube(url, "POST", jsonStr, models.Token)

// 	if code == 201 {
// 		return true
// 	} else {
// 		return false
// 	}
// }

// func CreateRole(name string, namespace string, models *model.ClusterToken) bool {
// 	// create Role
// 	role := model.Rule{
// 		Metadata: struct {
// 			Name      string `json:"name"`
// 			Namespace string `json:"namespace"`
// 		}{
// 			name,
// 			namespace},
// 		Rules: []struct {
// 			ApiGroups []string `json:"apiGroups"`
// 			Resources []string `json:"resources"`
// 			Verbs     []string `json:"verbs"`
// 		}{
// 			{metricParsing("*"), metricParsing("*"), metricParsing("*")},
// 			{metricParsing("*"), metricParsing("*"), metricParsing("*")}},
// 	}

// 	url := "https://" + models.Endpoint + ":6443/apis/rbac.authorization.k8s.io/v1/namespaces/" + namespace + "/roles"

// 	data, err := json.Marshal(role)
// 	if err != nil {
// 		fmt.Println(err)
// 		return false
// 	}

// 	var jsonStr = []byte(fmt.Sprint(string(data)))

// 	code, _ := RequsetKube(url, "POST", jsonStr, models.Token)

// 	if code == 201 {
// 		return true
// 	} else {
// 		return false
// 	}
// }

// func CreateRoleBinding(name string, namespace string, models *model.ClusterToken) bool {
// 	// create service account

// 	rolebinding := model.Rolebinding{
// 		Metadata: struct {
// 			Name      string `json:"name"`
// 			Namespace string `json:"namespace"`
// 		}{
// 			name,
// 			namespace},
// 		Subjects: []struct {
// 			Kind      string `json:"kind"`
// 			Name      string `json:"name"`
// 			Namespace string `json:"namespace"`
// 		}{
// 			{"ServiceAccount",
// 				name,
// 				namespace},
// 		},
// 		RoleRef: struct {
// 			Kind     string `json:"kind"`
// 			Name     string `json:"name"`
// 			APIGroup string `json:"apiGroup"`
// 		}{Kind: "Role", Name: name, APIGroup: "rbac.authorization.k8s.io"},
// 	}

// 	url := "https://" + models.Endpoint + ":6443/apis/rbac.authorization.k8s.io/v1/namespaces/" + namespace + "/rolebindings"

// 	data, err := json.Marshal(rolebinding)
// 	if err != nil {
// 		fmt.Println(err)
// 		return false
// 	}

// 	var jsonStr = []byte(fmt.Sprint(string(data)))

// 	code, _ := RequsetKube(url, "POST", jsonStr, models.Token)

// 	if code == 201 {
// 		return true
// 	} else {
// 		return false
// 	}
// }

// func GetProjectToken(name string, namespace string, models *model.ClusterToken) string {
// 	// request token name
// 	url := "https://" + models.Endpoint + ":6443/api/v1/namespaces/" + namespace + "/serviceaccounts/" + name

// 	_, body := RequsetKube(url, "GET", nil, models.Token)

// 	data := model.ServiceAccount{}
// 	err := json.Unmarshal([]byte(body), &data)

// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	// request token value
// 	url = "https://" + models.Endpoint + ":6443/api/v1/namespaces/" + namespace + "/secrets/" + data.Secrets[0].Name

// 	_, body = RequsetKube(url, "GET", nil, models.Token)

// 	fmt.Println("*****")
// 	fmt.Println(body)

// 	token := model.Secret{}
// 	err = json.Unmarshal([]byte(body), &token)

// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	fmt.Println(token)

// 	var result []string

// 	for i := 0; i < len(token.Data["token"]); i++ {
// 		result = append(result, string(token.Data["token"][i]))
// 	}

// 	stringArray := result
// 	tokenvalue := strings.Join(stringArray, "")

// 	return tokenvalue
// }

// func RequsetKube(url string, method string, reqdata []byte, token string) (int, string) {

// 	client := &http.Client{}
// 	req, err := http.NewRequest(method, url, bytes.NewBuffer(reqdata))

// 	req.Header.Add("Authorization", "Bearer "+token)
// 	req.Header.Add("Content-Type", "application/json")

// 	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

// 	res, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println(err)
// 		return 0, ""
// 	}
// 	defer res.Body.Close()

// 	body, err := ioutil.ReadAll(res.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 		return 0, ""
// 	}
// 	fmt.Println(string(body))

// 	return res.StatusCode, string(body)
// }
