package api

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"github.com/tidwall/gjson"
)

type Namespace struct {
	APIVersion string `json:"apiVersion"`
	Kind       string `json:"kind"`
	Metadata   struct {
		Name string `json:"name"`
		Labels struct{
			IstioCheck string `json:"istio-injection"`
		} `json:"labels"`
	} `json:"metadata"`
	Spec struct {
	} `json:"spec"`
	Status struct {
	} `json:"status"`
}

func GetAllProjects(c echo.Context) (err error) {
	db := db.DbManager()
	models := []model.Project{}
	db.Find(&models)

	if db.Find(&models).RowsAffected == 0 {
		common.ErrorMsg(c, http.StatusOK, common.ErrNoData)
		return
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

// func GetAllDBProjects(c echo.Context) []model.Project {
// 	db := db.DbManager()
// 	models := []model.Project{}
// 	db.Find(&models)

// 	if db.Find(&models).RowsAffected == 0 {
// 		common.ErrorMsg(c, http.StatusOK, common.ErrNoData)

// 	}

// 	return models
// }
// func GetProject2(c echo.Context) *model.Project {
// 	db := db.DbManager()
// 	search_val := c.Param("name")
// 	models := FindProjectDB(db, "Name", search_val)

// 	if models == nil {
// 		// common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
// 		var model model.Project
// 		model.Type = "system"
// 		return &model
// 	}

// 	return models
// }
func GetDBProject(params model.PARAMS) *model.Project {
	db := db.DbManager()
	search_val := params.Name
	models := FindProjectDB(db, "Name", search_val)

	if models == nil {
		// common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		var model model.Project
		model.Type = "system"
		model.WorkspaceName = "system"
		model.SelectCluster = params.Cluster
		return &model
	}

	return models
}

// func GetProject(c echo.Context) (err error) {
// 	db := db.DbManager()
// 	search_val := c.Param("name")
// 	models := FindProjectDB(db, "Name", search_val)

// 	if models == nil {
// 		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
// 		return
// 	}

// 	return c.JSON(http.StatusOK, echo.Map{"data": models})
// }

func CreateProject(c echo.Context) (err error) {

	err, models := CreateProjectDB(c)

	if err != nil {
		return err
	}

	selectCluster := models.SelectCluster
	slice := strings.Split(selectCluster, ",")

	for _, cluster := range slice {

		clusters := GetClusterDB(cluster)
		namesapce := Namespace{}
		namesapce.APIVersion = "v1"
		namesapce.Kind = "Namespace"
		namesapce.Metadata.Name = models.Name
		namesapce.Metadata.Labels.IstioCheck = models.IstioCheck
		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/"
		Token := clusters.Token

		data, err := json.Marshal(namesapce)
		fmt.Printf("// %s",data)
		if err != nil {
			common.ErrorMsg(c, http.StatusBadRequest, err)
			return err
		}

		var jsonStr = []byte(fmt.Sprint(string(data)))

		code := RequsetKube(url, "POST", jsonStr, Token)

		switch code {
		case 200:
		case 201:
		case 202:
		default:
			common.ErrorMsg(c, http.StatusBadRequest, err)
			return err
		}
	}

	return c.JSON(http.StatusCreated, echo.Map{"data": models})
}

func UpdateProject(c echo.Context) (err error) {
	//Patch
	name := c.Param("name")
	if check := strings.Compare(name, "") == 0; check {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return err
	}

	models := GetProjectModel(name)
	selectCluster := models.SelectCluster
	slice := strings.Split(selectCluster, ",")

	for _, cluster := range slice {
		clusters := GetClusterDB(cluster)

		namesapce := Namespace{}

		//patch 요청시 Body 내용에 대해 수정이 필요함.
		namesapce.APIVersion = "v1"
		namesapce.Kind = "Namespace"
		namesapce.Metadata.Name = models.Name

		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/" + name
		Token := clusters.Token

		data, err := json.Marshal(namesapce)

		if err != nil {
			common.ErrorMsg(c, http.StatusBadRequest, err)
			return err
		}

		var jsonStr = []byte(fmt.Sprint(string(data)))

		code := RequsetKube(url, "PATCH", jsonStr, Token)

		switch code {
		case 200:
		case 201:
		default:
			common.ErrorMsg(c, http.StatusBadRequest, err)
			return err
		}
	}
	SaveProjectDB(c)
	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func ReplaceProject(c echo.Context) (err error) {
	//PUT
	return nil
}

func DeleteProject(c echo.Context) (err error) {

	name := c.Param("name")
	if check := strings.Compare(name, "") == 0; check {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return err
	}

	models := GetProjectModel(name)
	selectCluster := models.SelectCluster
	slice := strings.Split(selectCluster, ",")
	for _, cluster := range slice {
		clusters := GetClusterDB(cluster)

		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/" + name
		Token := clusters.Token

		if err != nil {
			common.ErrorMsg(c, http.StatusBadRequest, err)
			return err
		}

		code := RequsetKube(url, "DELETE", nil, Token)

		switch code {
		case 200:
		case 202:
		default:
			common.ErrorMsg(c, http.StatusBadRequest, err)
			return err
		}
	}
	DeleteProjectDB(c)

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func FindProjectDB(db *gorm.DB, select_val string, search_val string) *model.Project {
	models := model.Project{}
	if check := strings.Compare(search_val, "") == 0; check {
		return nil
	}
	if strings.Compare(select_val, "Name") == 0 {
		if err := db.First(&models, model.Project{Name: search_val}).Error; err != nil {
			return nil
		}
	}
	return &models
}
func GetProject(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "namespaces",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	// params.Workspace = c.Param("name")
	getData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	if common.FindData(getData, "status", "") == "Failure" {
		fmt.Printf("error code : %s\n", getData)
		err_data := common.InterfaceToString(getData)
		// errReturn := KubernetesNS.Array()
		errJson := make(map[string]string)
		err_ns := json.Unmarshal([]byte(err_data), &errJson)
		if err_ns != nil {
			fmt.Printf("err_ns : %s\n", err_ns)
		}
		// 	common.ErrorMsg(c, http.StatusNotFound, err)
		// return c.JSON(http.StatusNotFound, errJson)
		return c.JSON(http.StatusNotFound, errJson)
	}
	project := GetDBProject(params)
	var tsproject model.Project
	var projectModel model.PROJECT
	common.Transcode(project, &tsproject)
	common.Transcode(tsproject, &projectModel)

	// proejectModel.Project = tsproject
	projectModel.Name = common.InterfaceToString(common.FindData(getData, "metadata", "name"))
	projectModel.CreateAt = common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp"))
	projectModel.Label = common.FindData(getData, "metadata", "labels")
	projectModel.Annotation = common.FindData(getData, "metadata", "annotations")
	params.Workspace = projectModel.WorkspaceName
	projectModel.Status = common.InterfaceToString(common.FindData(getData, "status", "phase"))
	projectModel.ClusterName = c.QueryParam("cluster")
	projectModel.Events = getCallEvent(params)
	ResourceCnt := model.PROJECT_RESOURCE{
		DeploymentCount: ResourceCnt(params, "deployments"),
		PodCount:        ResourceCnt(params, "pods"),
		ServiceCount:    ResourceCnt(params, "services"),
		CronjobCount:    ResourceCnt(params, "cronjobs"),
		JobCount:        ResourceCnt(params, "jobs"),
		// VolumeCount:     ResourceCnt(params, "deployments"),
	}

	projectModel.Resource = ResourceCnt
	return c.JSON(http.StatusOK, echo.Map{
		"data": projectModel,
	})
}
func GetProjects(c echo.Context) (err error) {
	var Projects model.PROJECTS
	params := model.PARAMS{
		Kind:      "namespaces",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("cluster"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	if c.QueryParam("workspace") == "" && c.QueryParam("cluster") != "" {
		// params.Workspace = c.QueryParam("cluster")
		// params.Project = c.QueryParam("cluster")
		getData, err := common.DataRequest(params)
		if err != nil {
			common.ErrorMsg(c, http.StatusNotFound, err)
			return nil
		}
		getData0 := common.FindingArray(common.Finding(getData, "items"))
		for k, _ := range getData0 {
			params.Name = (gjson.Get(getData0[k].String(), "metadata.name")).String()
			project := GetDBProject(params)
			var tsproject model.Project
			var Project model.PROJECT
			common.Transcode(project, &tsproject)
			common.Transcode(tsproject, &Project)
			Project.Name = params.Name
			Project.Status = (gjson.Get(getData0[k].String(), "status.phase")).String()
			Project.CreateAt = (gjson.Get(getData0[k].String(), "metadata.creationTimestamp")).Time()
			Project.ClusterName = params.Cluster
			tempMetric := []string{"namespace_cpu", "namespace_memory", "namespace_pod_count"}
			tempresult := NowMonit("namespace", params.Cluster, params.Name, tempMetric)
			Project.ResourceUsage = tempresult
			Projects = append(Projects, Project)
		}
	} else if c.QueryParam("workspace") != "" && c.QueryParam("cluster") == "" {
		workspace := GetDBWorkspace(params)
		if workspace == nil {
			common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
			return
		}
		selectCluster := workspace.SelectCluster
		slice := strings.Split(selectCluster, ",")
		for i, _ := range slice {
			params.Cluster = slice[i]
			params.Name = ""
			getData, err := common.DataRequest(params)
			if err != nil {
				common.ErrorMsg(c, http.StatusNotFound, err)
				return nil
			}
			getData0 := common.FindingArray(common.Finding(getData, "items"))
			for k, _ := range getData0 {
				params.Name = (gjson.Get(getData0[k].String(), "metadata.name")).String()
				project := GetDBProject(params)
				var tsproject model.Project
				var Project model.PROJECT
				common.Transcode(project, &tsproject)
				common.Transcode(tsproject, &Project)
				Project.Name = params.Name
				Project.Status = (gjson.Get(getData0[k].String(), "status.phase")).String()
				Project.CreateAt = (gjson.Get(getData0[k].String(), "metadata.creationTimestamp")).Time()
				Project.ClusterName = params.Cluster
				tempMetric := []string{"namespace_cpu", "namespace_memory", "namespace_pod_count"}
				tempresult := NowMonit("namespace", params.Cluster, params.Name, tempMetric)
				Project.ResourceUsage = tempresult
				Projects = append(Projects, Project)
			}
		}
	} else {
		Clusters := GetAllDBClusters(params)
		for i, _ := range Clusters {
			params.Cluster = Clusters[i].Name
			// params.Workspace = Clusters[i].Name
			params.Name = ""
			getData, err := common.DataRequest(params)
			if err != nil {
				common.ErrorMsg(c, http.StatusNotFound, err)
				return nil
			}
			getData0 := common.FindingArray(common.Finding(getData, "items"))
			for k, _ := range getData0 {
				params.Name = (gjson.Get(getData0[k].String(), "metadata.name")).String()
				project := GetDBProject(params)
				var tsproject model.Project
				var Project model.PROJECT
				common.Transcode(project, &tsproject)
				common.Transcode(tsproject, &Project)
				Project.Name = params.Name
				Project.Status = (gjson.Get(getData0[k].String(), "status.phase")).String()
				Project.CreateAt = (gjson.Get(getData0[k].String(), "metadata.creationTimestamp")).Time()
				Project.ClusterName = params.Cluster
				tempMetric := []string{"namespace_cpu", "namespace_memory", "namespace_pod_count"}
				tempresult := NowMonit("namespace", Project.ClusterName, Project.Name, tempMetric)
				Project.ResourceUsage = tempresult
				Projects = append(Projects, Project)
			}
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": Projects,
	})
	// return nil
}
func ResourceCnt(params model.PARAMS, kind string) int {
	fmt.Printf("[##]params : %+v\n", params)
	params.Kind = kind
	params.Project = params.Name
	params.Name = ""
	// cnt := 0
	deployment_cnt := 0
	deployments, _ := common.DataRequest(params)
	deployment := common.FindingArray(common.Finding(deployments, "items"))
	// if kind == "pods" {
	// 	for i, _ := range deployment {
	// 		phase := gjson.Get(deployment[i].String(), "status.phase").String()
	// 		if phase == "Running" {
	// 			cnt++
	// 		}
	// 	}
	// 	deployment_cnt = cnt
	// } else {
	// 	deployment_cnt = common.FindingLen2(deployment)
	// }
	deployment_cnt = common.FindingLen2(deployment)
	// fmt.Printf("deployment_cnt : %d\n", deployment_cnt)
	return deployment_cnt
}

func RequsetKube(url string, method string, reqdata []byte, token string) int {

	switch method {
	case "POST":
		client := &http.Client{}
		req, _ := http.NewRequest(method, url, bytes.NewBuffer(reqdata))

		req.Header.Add("Authorization", "Bearer "+token)
		req.Header.Add("Content-Type", "application/json")

		http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

		res, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return 0
		}
		defer res.Body.Close()

		// body, err := ioutil.ReadAll(res.Body)
		// if err != nil {
		// 	fmt.Println(err)
		// 	return 0
		// }

		// return res.StatusCode, string(body)
		return res.StatusCode
	case "DELETE":
		client := &http.Client{}
		req, _ := http.NewRequest(method, url, nil)

		req.Header.Add("Authorization", "Bearer "+token)
		req.Header.Add("Content-Type", "application/json")

		http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

		res, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return 500
		}

		return res.StatusCode
	case "PUT":
	case "PATCH":
	}

	return 404
}

// func RequsetKubeDelete(url string, method string, token string) int {

// 	client := &http.Client{}
// 	req, _ := http.NewRequest(method, url, nil)

// 	req.Header.Add("Authorization", "Bearer "+token)
// 	req.Header.Add("Content-Type", "application/json")

// 	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

// 	res, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println(err)
// 		return 500
// 	}

// 	return res.StatusCode
// }

func GetClusterDB(str string) *model.Cluster {
	search_val := str
	db := db.DbManager()
	models := FindClusterDB(db, "Name", search_val)

	return models
}

func GetProjectModel(str string) *model.Project {
	db := db.DbManager()
	models := FindProjectDB(db, "Name", str)

	return models
}

func DeleteProjectDB(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")
	// fmt.Println(search_val)

	if err := FindProjectDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	}

	models := FindProjectDB(db, "Name", search_val)
	fmt.Println(models)
	if err := db.Delete(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
		return nil
	}

	return nil
}

func CreateProjectDB(c echo.Context) (err error, st *model.Project) {
	db := db.DbManager()
	models := new(model.Project)

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return err, models
	}

	if err = c.Validate(models); err != nil {
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return err, models
	}

	if check := strings.Compare(models.Name, "") == 0; check {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return err, models
	}

	if err != nil {
		panic(err)
	}

	if err := db.Create(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)

		return err, models
	}

	return nil, models
}

func SaveProjectDB(c echo.Context) (err error) {

	db := db.DbManager()
	search_val := c.Param("name")
	models := model.Project{}

	if err := c.Bind(&models); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}

	if err := FindProjectDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	} else {
		models.Name = search_val
	}

	models2 := FindProjectDB(db, "Name", search_val)

	if models.SelectCluster != "" {
		models2.SelectCluster = models.SelectCluster
	}
	if models.Description != "" {
		models2.Description = models.Description
	}
	if models.Type != "" {
		models2.Type = models.Type
	}
	if models.Owner != "" {
		models2.Owner = models.Owner
	}
	if models.Creator != "" {
		models2.Creator = models.Creator
	}
	if models.WorkspaceName != "" {
		models2.WorkspaceName = models.WorkspaceName
	}

	if err := db.Save(&models2).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return nil
}
