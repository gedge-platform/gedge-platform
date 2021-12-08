package api

import (
	"fmt"
	"net/http"
	"strings"

	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
)

func GetAllClusters(c echo.Context) (err error) {
	db := db.DbManager()
	models := []model.Cluster{}
	db.Find(&models)

	if db.Find(&models).RowsAffected == 0 {
		common.ErrorMsg(c, http.StatusOK, common.ErrNoData)
		return
	}
	fmt.Printf("[3##]models : %+v\n", models)
	return c.JSON(http.StatusOK, echo.Map{"data": models})
}
func GetAllDBClusters(params model.PARAMS) []model.Cluster {
	db := db.DbManager()
	models := []model.Cluster{}
	db.Find(&models)

	if db.Find(&models).RowsAffected == 0 {
		// common.ErrorMsg(c, http.StatusOK, common.ErrNoData)
		return nil
	}
	fmt.Printf("[3##]models : %+v\n", models)
	return models
}

// func GetCluster(c echo.Context) (err error) {
// 	db := db.DbManager()
// 	search_val := c.Param("name")
// 	models := FindClusterDB(db, "Name", search_val)

// 	if models == nil {
// 		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
// 		return
// 	}

// 	return c.JSON(http.StatusOK, echo.Map{"data": models})
// }

func GetDBCluster(params model.PARAMS) *model.Cluster {
	search_val := params.Name
	db := db.DbManager()
	// search_val := c.Param("name")
	models := FindClusterDB(db, "Name", search_val)

	if models == nil {
		var model model.Cluster
		model.Name = params.Name
		return &model
	}

	return models
}

func CreateCluster(c echo.Context) (err error) {
	db := db.DbManager()
	models := new(model.Cluster)

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}
	if err = c.Validate(models); err != nil {
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return nil
	}

	if err != nil {
		panic(err)
	}

	if err := db.Create(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return c.JSON(http.StatusCreated, echo.Map{"data": models})
}

func UpdateCluster(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")
	models := model.Cluster{}

	if err := c.Bind(&models); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}

	if err := FindClusterDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	} else {
		models.Name = search_val
	}

	models2 := FindClusterDB(db, "Name", search_val)

	if models.Ip != "" {
		models2.Ip = models.Ip
	}
	// if models.extIp != "" { models2.extIp = models.extIp }
	// if models.Role != "" {
	// 	models2.Role = models.Role
	// }
	if models.Type != "" {
		models2.Type = models.Type
	}
	if models.Endpoint != "" {
		models2.Endpoint = models.Endpoint
	}
	if models.Creator != "" {
		models2.Creator = models.Creator
	}
	// if models.Version != "" {
	// 	models2.Version = models.Version
	// }

	if err := db.Save(&models2).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models2})
}

func DeleteCluster(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")

	if err := FindClusterDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, common.ErrNotFound)
		return nil
	}

	models := FindClusterDB(db, "Name", search_val)

	if err := db.Delete(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func FindClusterDB(db *gorm.DB, select_val string, search_val string) *model.Cluster {
	models := model.Cluster{}

	if check := strings.Compare(search_val, "") == 0; check {
		return nil
	}

	if strings.Compare(select_val, "Name") == 0 {
		if err := db.First(&models, model.Cluster{Name: search_val}).Error; err != nil {
			return nil
		}
	}
	return &models
}
func ClusterResourceCnt(params model.PARAMS, kind string) int {
	fmt.Printf("[##]params : %+v\n", params)
	params.Kind = kind
	params.Project = ""
	params.Name = ""
	deployments, _ := common.DataRequest(params)
	deployment := common.FindingArray(common.Finding(deployments, "items"))
	// for i, _ := range deployment {
	// 	fmt.Printf("[##]names : %s\n", (gjson.Get(deployment[i].String(), "metadata.name")).String())
	// 	fmt.Printf("[##]index : %d\n", i)
	// }
	deployment_cnt := common.FindingLen2(deployment)
	// fmt.Printf("deployment_cnt : %d\n", deployment_cnt)
	return deployment_cnt
}
func GetCluster(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "nodes",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	params.Cluster = params.Name
	params.Name = ""

	getData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	Master, Worker, _ := common.FindDataLabelKey(getData, "items", "labels", "node-role.kubernetes.io/master")
	var MasterList []model.CLUSTER
	var WorkerList []model.CLUSTER
	for m, _ := range Master {
		params.Name = params.Cluster
		cluster := GetDBCluster(params)
		if cluster == nil {
			common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
			return nil
		}
		var tsCluster model.Cluster
		var clusterModel model.CLUSTER
		common.Transcode(cluster, &tsCluster)
		common.Transcode(tsCluster, &clusterModel)

		gpuList, check := GpuCheck(params.Name)
		if check != false {
			clusterModel.Gpu = gpuList
		} else {
			clusterModel.Gpu = nil
		}
		ResourceCnt := model.PROJECT_RESOURCE{
			DeploymentCount: ClusterResourceCnt(params, "deployments"),
			PodCount:        ClusterResourceCnt(params, "pods"),
			ServiceCount:    ClusterResourceCnt(params, "services"),
			CronjobCount:    ClusterResourceCnt(params, "cronjobs"),
			JobCount:        ClusterResourceCnt(params, "jobs"),
			// VolumeCount:     ResourceCnt(params, "deployments"),
		}
		clusterModel.Label = common.FindData(Master[m], "metadata", "labels")
		clusterModel.Annotation = common.FindData(Master[m], "metadata", "annotations")
		clusterModel.Allocatable = common.FindData(Master[m], "status", "allocatable")
		clusterModel.Capacity = common.FindData(Master[m], "status", "capacity")
		clusterModel.Created_at = common.InterfaceToTime(common.FindData(Master[m], "metadata", "creationTimestamp"))
		clusterModel.Version = common.InterfaceToString(common.FindData(Master[m], "status.nodeInfo", "kubeletVersion"))
		clusterModel.Os = common.InterfaceToString(common.FindData(Master[m], "status.nodeInfo", "operatingSystem")) + " / " + common.InterfaceToString(common.FindData(Master[m], "status.nodeInfo", "osImage"))
		clusterModel.Kernel = common.InterfaceToString(common.FindData(Master[m], "status.nodeInfo", "kernelVersion"))
		clusterModel.ContainerRuntimeVersion = common.InterfaceToString(common.FindData(Master[m], "status.nodeInfo", "containerRuntimeVersion"))
		clusterModel.Events = getCallEvent(params)
		clusterModel.Resource = ResourceCnt
		// common.Transcode(Master[m], &clusterModel)
		MasterList = append(MasterList, clusterModel)
	}
	if Worker != nil {
		for m, _ := range Worker {
			// params.Name = params.Cluster
			// cluster := GetDBCluster(params)
			// if cluster == nil {
			// 	common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
			// 	return nil
			// }
			// var tsCluster model.Cluster
			// var clusterModel model.CLUSTER

			addressesData := common.FindData(Worker[m], "status", "addresses")
			var addressesList []model.ADDRESSES
			common.Transcode(addressesData, &addressesList)
			clusterInfo := model.Cluster{
				Name:       common.InterfaceToString(common.FindData(Worker[m], "metadata", "name")),
				Created_at: common.InterfaceToTime(common.FindData(Worker[m], "metadata", "creationTimestamp")),
			}
			// common.Transcode(clusterInfo, &clusterModel)
			var GPUList []map[string]interface{}
			gpuCheck, check := GpuCheck(params.Name)
			if check != false {
				GPUList = gpuCheck
			} else {
				GPUList = nil
			}
			clusterModel := model.CLUSTER{
				Cluster: clusterInfo,
				// clusterModel.ipAddr = common.InterfaceToString(common.FindData(Worker[m], "metadata", "name"))
				Gpu:                     GPUList,
				Addresses:               addressesList,
				Allocatable:             common.FindData(Worker[m], "status", "allocatable"),
				Capacity:                common.FindData(Worker[m], "status", "capacity"),
				Label:                   common.FindData(Worker[m], "metadata", "labels"),
				Annotation:              common.FindData(Worker[m], "metadata", "annotations"),
				Version:                 common.InterfaceToString(common.FindData(Worker[m], "status.nodeInfo", "kubeletVersion")),
				Os:                      common.InterfaceToString(common.FindData(Worker[m], "status.nodeInfo", "operatingSystem")) + " / " + common.InterfaceToString(common.FindData(Worker[m], "status.nodeInfo", "osImage")),
				Kernel:                  common.InterfaceToString(common.FindData(Worker[m], "status.nodeInfo", "kernelVersion")),
				ContainerRuntimeVersion: common.InterfaceToString(common.FindData(Worker[m], "status.nodeInfo", "containerRuntimeVersion")),
				Events:                  getCallEvent(params),
				// Resource:                nil,
			}
			// fmt.Println("[###############nodeip]", common.FindDataStr(Worker[m], "status", "addresses"))

			// common.Transcode(Master[m], &clusterModel)
			WorkerList = append(WorkerList, clusterModel)
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"master": MasterList,
		"worker": WorkerList,
	})
}

// getData0 := gjson.Get(getData, "items").Array()
// for k, _ := range getData0 {
// 	fmt.Println("clusters!!!!!!!!!!!!!", getData0[k])

// }
// cluster := GetDBCluster(params)
// if cluster == nil {
// 	common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
// 	return nil
// }
// var tsCluster model.Cluster
// var clusterModel model.CLUSTER
// common.Transcode(cluster, &tsCluster)
// common.Transcode(tsCluster, &clusterModel)

// gpuList, check := GpuCheck(params.Name)
// if check != false {
// 	clusterModel.Gpu = gpuList
// } else {
// 	clusterModel.Gpu = nil
// }
// clusterModel.Label = common.FindData(getData, "metadata", "labels")
// clusterModel.Annotation = common.FindData(getData, "metadata", "annotations")
// clusterModel.Created_at = common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp"))
// clusterModel.Version = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "kubeletVersion"))
// clusterModel.Os = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "operatingSystem")) + " / " + common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "osImage"))
// clusterModel.Kernel = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "kernelVersion"))
// clusterModel.Events = getCallEvent(params)
// common.Transcode(getData0, &clusterModel)

// return nil

func GetClusters(c echo.Context) (err error) {
	var clusterList []model.CLUSTER
	params := model.PARAMS{
		Kind: "nodes",
		// Name:      clusterModel[k].Name,
		// Cluster:   clusterModel[k].Name,
		// Workspace: clusterModel[k].Name,
		// Project:   clusterModel[k].Name,
		Method: c.Request().Method,
		Body:   responseBody(c.Request().Body),
	}
	if c.QueryParam("workspace") == "" {
		clusters := GetAllDBClusters(params)
		if clusters == nil {
			common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
			return nil
		}
		for k, _ := range clusters {
			fmt.Printf("value : %+v\n", clusters[k].Name)
			params.Name = clusters[k].Name
			params.Cluster = clusters[k].Name
			// params.Workspace = clusters[k].Name
			// params.Project = clusters[k].Name
			// params.Name = value.Name
			getData, err := common.DataRequest(params)
			if err != nil {
				common.ErrorMsg(c, http.StatusNotFound, err)
				return nil
			}
			var clusterModel model.CLUSTER
			common.Transcode(clusters[k], &clusterModel)
			gpuList, check := GpuCheck(params.Name)
			if check != false {
				clusterModel.Gpu = gpuList
			} else {
				clusterModel.Gpu = nil
			}
			clusterModel.Label = common.FindData(getData, "metadata", "labels")
			clusterModel.Annotation = common.FindData(getData, "metadata", "annotations")
			clusterModel.CreateAt = common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp"))
			clusterModel.Version = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "kubeletVersion"))
			clusterModel.Os = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "operatingSystem"))
			clusterModel.Kernel = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "kernelVersion"))
			tempMetric := []string{"cpu_usage", "memory_usage", "pod_running"}
			tempresult := NowMonit("cluster", params.Cluster, params.Name, tempMetric)
			clusterModel.ResourceUsage = tempresult
			clusterList = append(clusterList, clusterModel)
			// clusterModel[k].Kernel = "123"
		}
		return c.JSON(http.StatusOK, echo.Map{
			"data": clusterList,
		})
	} else {
		params.Workspace = c.QueryParam("workspace")
		workspace := GetDBWorkspace(params)
		if workspace == nil {
			common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
			return
		}
		selectCluster := workspace.SelectCluster
		slice := strings.Split(selectCluster, ",")
		for i, _ := range slice {
			params.Name = slice[i]
			params.Cluster = slice[i]
			// params.Project = slice[i]
			cluster := GetDBCluster(params)
			if cluster == nil {
				common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
				return nil
			}
			var tsCluster model.Cluster
			var clusterModel model.CLUSTER
			common.Transcode(cluster, &tsCluster)
			common.Transcode(tsCluster, &clusterModel)
			getData, err := common.DataRequest(params)
			if err != nil {
				common.ErrorMsg(c, http.StatusNotFound, err)
				return nil
			}
			fmt.Printf("[###data] : %s\n", getData)
			gpuList, check := GpuCheck(params.Name)
			if check != false {
				clusterModel.Gpu = gpuList
			} else {
				clusterModel.Gpu = nil
			}
			clusterModel.Label = common.FindData(getData, "metadata", "labels")
			clusterModel.Annotation = common.FindData(getData, "metadata", "annotations")
			clusterModel.CreateAt = common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp"))
			clusterModel.Version = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "kubeletVersion"))
			clusterModel.Os = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "operatingSystem"))
			clusterModel.Kernel = common.InterfaceToString(common.FindData(getData, "status.nodeInfo", "kernelVersion"))
			tempMetric := []string{"cpu_usage", "memory_usage", "pod_running"}
			tempresult := NowMonit("cluster", params.Cluster, params.Name, tempMetric)
			clusterModel.ResourceUsage = tempresult
			clusterList = append(clusterList, clusterModel)

		}
		return c.JSON(http.StatusOK, echo.Map{
			"data": clusterList,
		})
	}

}
