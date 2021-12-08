package api

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"strings"

	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"
)

func GetModelList(params model.PARAMS) []string {
	// t := time.Now()
	// start_time := time.Unix(t.Unix(), 0)

	// fmt.Printf("#################params List : %+v\n", params)
	// staticKind := params.Kind
	var DataList []string

	if params.Workspace == "" && params.Cluster == "" && params.Project == "" {
		fmt.Println("#################ALL List")
		Clusters := GetAllDBClusters(params)
		for c, _ := range Clusters {
			params.Cluster = Clusters[c].Name
			// params.Workspace = Clusters[c].Name
			// params.Kind = "namespaces"
			getData, _ := common.DataRequest(params)
			getData0 := gjson.Get(getData, "items").Array()
			// getData0 := common.FindingArray(common.Finding(getData, "items"))
			for k, _ := range getData0 {
				str := getData0[k].String()
				namespace := gjson.Get(str, "metadata.namespace")
				params.Name = namespace.String()
				projectCheck := GetDBProject(params)
				params.Name = ""
				strVal, _ := sjson.Set(str, "clusterName", Clusters[c].Name)
				strVal2, _ := sjson.Set(strVal, "workspaceName", projectCheck.WorkspaceName)
				DataList = append(DataList, strVal2)
			}
		}
		// t2 := time.Now()
		// end_time := time.Unix(t2.Unix(), 0)
		// fmt.Printf("Time : %s,%s", end_time, start_time)
		return DataList

	} else if params.Workspace == "" && params.Cluster != "" && params.Project == "" {
		fmt.Println("#################Cluster List")
		getData, _ := common.DataRequest(params)
		getData0 := gjson.Get(getData, "items").Array()
		for k, _ := range getData0 {
			str := getData0[k].String()
			namespace := gjson.Get(str, "metadata.namespace")
			params.Name = namespace.String()
			projectCheck := GetDBProject(params)
			params.Name = ""
			strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
			strVal2, _ := sjson.Set(strVal, "workspaceName", projectCheck.WorkspaceName)
			DataList = append(DataList, strVal2)
		}
		return DataList
	} else if params.Workspace != "" && params.Cluster == "" && params.Project == "" {
		fmt.Println("#################Workspace List")
		if params.Workspace == "system" {
			Clusters := GetAllDBClusters(params)
			for c, _ := range Clusters {
				params.Cluster = Clusters[c].Name
				getData, _ := common.DataRequest(params)
				getData0 := gjson.Get(getData, "items").Array()
				for k, _ := range getData0 {
					str := getData0[k].String()
					params.Name = gjson.Get(str, "metadata.namespace").String()
					// fmt.Println("[#####params.Project]", params.Project)
					projectType := common.InterfaceToString(GetDBProject(params).WorkspaceName)
					// fmt.Println("[#####projectType]", projectType)
					params.Name = ""
					if projectType == params.Workspace {
						strVal, _ := sjson.Set(str, "clusterName", Clusters[c].Name)
						strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
						DataList = append(DataList, strVal2)
					}
				}

			}
			return DataList
		} else {
			workspace := GetDBWorkspace(params)
			selectCluster := workspace.SelectCluster
			slice := strings.Split(selectCluster, ",")
			for w, _ := range slice {
				params.Cluster = slice[w]
				getData, _ := common.DataRequest(params)
				getData0 := gjson.Get(getData, "items").Array()
				for k, _ := range getData0 {
					str := getData0[k].String()
					params.Name = gjson.Get(str, "metadata.namespace").String()
					projectType := common.InterfaceToString(GetDBProject(params).Type)
					// fmt.Println("[#####projectType]", projectType)
					params.Name = ""
					if projectType == "user" {
						strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
						strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
						DataList = append(DataList, strVal2)
					}
				}
			}
			return DataList
		}

	} else if params.Project != "" && params.Workspace != "" {
		fmt.Println("#################Project List")
		if params.Workspace == "system" {
			Clusters := GetAllDBClusters(params)
			for c, _ := range Clusters {
				params.Cluster = Clusters[c].Name
				getData, _ := common.DataRequest(params)
				getData0 := gjson.Get(getData, "items").Array()
				for k, _ := range getData0 {
					str := getData0[k].String()
					strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
					strVal2, _ := sjson.Set(strVal, "clusterName", params.Workspace)
					DataList = append(DataList, strVal2)
				}

			}
			return DataList
		} else {
			params.Name = params.Project
			project := GetDBProject(params)
			params.Name = ""
			if project.Type == "user" {
				selectCluster := project.SelectCluster
				slice := strings.Split(selectCluster, ",")
				for w, _ := range slice {
					params.Cluster = slice[w]
					// fmt.Printf("#################clusterName:%s\n", params.Cluster)
					getData, _ := common.DataRequest(params)
					getData0 := gjson.Get(getData, "items").Array()
					// getData0 := common.FindingArray(common.Finding(getData, "items"))
					for k, _ := range getData0 {
						str := getData0[k].String()
						strVal, _ := sjson.Set(str, "clusterName", slice[w])
						strVal2, _ := sjson.Set(strVal, "clusterName", params.Workspace)
						DataList = append(DataList, strVal2)
					}
				}
				return DataList
			}
		}

		// project := GetDBProject(params)
		// if project.Type == "user" {
		// 	fmt.Println("#################user project")
		// 	if project.WorkspaceName != params.Workspace {
		// 		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrNotFound)
		// 		DataList = append(DataList, common.InterfaceToString(msg))
		// 		return DataList
		// 	}
		// 	selectCluster := project.SelectCluster
		// 	slice := strings.Split(selectCluster, ",")
		// 	for w, _ := range slice {
		// 		params.Cluster = slice[w]
		// 		// fmt.Printf("#################clusterName:%s\n", params.Cluster)
		// 		getData, _ := common.DataRequest(params)
		// 		getData0 := gjson.Get(getData, "items").Array()
		// 		// getData0 := common.FindingArray(common.Finding(getData, "items"))
		// 		for k, _ := range getData0 {
		// 			str := getData0[k].String()
		// 			strVal, _ := sjson.Set(str, "clusterName", slice[w])
		// 			DataList = append(DataList, strVal)
		// 		}
		// 	}
		// 	return DataList
		// }
		// workspace := GetDBWorkspace(params)
		// selectCluster := workspace.SelectCluster
		// slice := strings.Split(selectCluster, ",")
		// for w, _ := range slice {
		// 	params.Cluster = slice[w]
		// 	// params.Name = ""
		// 	params.Kind = staticKind
		// 	getData, _ := common.DataRequest(params)
		// 	getData0 := common.FindingArray(common.Finding(getData, "items"))
		// 	for k, _ := range getData0 {
		// 		str := getData0[k].String()
		// 		strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
		// 		DataList = append(DataList, strVal)
		// 	}
		// 	// DataList = append(DataList, getData0)
		// }
		// }
		// return DataList

	} else if params.Project != "" && params.Cluster != "" {
		fmt.Println("#################Project in Cluster List")
		// params.Workspace = params.Cluster
		getData, _ := common.DataRequest(params)
		getData0 := gjson.Get(getData, "items").Array()
		// getData0 := common.FindingArray(common.Finding(getData, "items"))
		for k, _ := range getData0 {
			str := getData0[k].String()
			strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
			DataList = append(DataList, strVal)
		}

		return DataList

	}
	return nil
}
