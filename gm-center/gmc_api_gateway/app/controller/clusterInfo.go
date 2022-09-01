package controller

import (
	// "fmt"

	"gmc_api_gateway/app/common"
	"net/http"

	"gmc_api_gateway/app/model"

	"github.com/labstack/echo/v4"
)

func GetClusterInfo(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "nodes",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	var ClusterInfoList []model.ClusterInfo
	// params.Name = c.QueryParam("project")
	project := GetDBProject(params)
	if project.Name == "" {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	}
	selectCluster := project.Selectcluster
	// slice := strings.Split(selectCluster, ",")
	for _, cluster := range selectCluster {
		if FindClusterDB(cluster.Name).Name == "" {
			common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
			return nil
		}
		var NodeInfoList []model.NodeInfo
		params.Name = ""
		params.Cluster = cluster.Name
		getData, err := common.DataRequest(params)
		if err != nil {
			common.ErrorMsg(c, http.StatusNotFound, err)
			return nil
		}
		Nodes, _ := common.FindDataLabelKey(getData, "items", "labels", "node-role.kubernetes.io/master")
		for n, _ := range Nodes {
			Node := model.NodeInfo{
				Name: common.InterfaceToString(common.FindData(Nodes[n], "metadata", "name")),
				Type: common.InterfaceToString(common.FindData(Nodes[n], "nodeType", "")),
				Ip:   common.InterfaceToString(common.FindData(Nodes[n], "status", "addresses.0.address")),
			}
			NodeInfoList = append(NodeInfoList, Node)
		}
		clusterInfo := model.ClusterInfo{
			ClusterName: cluster.Name,
			Type:        cluster.Type,
			Nodes:       NodeInfoList,
		}
		ClusterInfoList = append(ClusterInfoList, clusterInfo)
	}

	// 	params.Name = slice[i]
	// 	cluster := GetDBCluster(params)
	// 	if cluster == nil {
	// 		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
	// 		return nil
	// 	}
	// 	var tsCluster model.Cluster
	// 	var clusterModel model.CLUSTER
	// 	common.Transcode(cluster, &tsCluster)
	// 	common.Transcode(tsCluster, &clusterModel)
	// 	var NodeInfoList []model.NodeInfo
	// 	params.Name = ""
	// 	params.Cluster = slice[i]
	// 	getData, err := common.DataRequest(params)
	// 	if err != nil {
	// 		common.ErrorMsg(c, http.StatusNotFound, err)
	// 		return nil
	// 	}
	// 	Nodes, _ := common.FindDataLabelKey(getData, "items", "labels", "node-role.kubernetes.io/master")
	// 	for n, _ := range Nodes {
	// 		Node := model.NodeInfo{
	// 			Name: common.InterfaceToString(common.FindData(Nodes[n], "metadata", "name")),
	// 			Type: common.InterfaceToString(common.FindData(Nodes[n], "nodeType", "")),
	// 			Ip:   common.InterfaceToString(common.FindData(Nodes[n], "status", "addresses.0.address")),
	// 		}
	// 		NodeInfoList = append(NodeInfoList, Node)
	// 	}
	// 	clusterInfo := model.ClusterInfo{
	// 		ClusterName: clusterModel.Name,
	// 		Type:        clusterModel.Type,
	// 		Nodes:       NodeInfoList,
	// 	}
	// 	ClusterInfoList = append(ClusterInfoList, clusterInfo)
	// }

	return c.JSON(http.StatusOK, echo.Map{
		"data": ClusterInfoList,
	})
}
