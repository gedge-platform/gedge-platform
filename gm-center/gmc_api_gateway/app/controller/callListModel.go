package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"

	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"
)

func GetModelList(params model.PARAMS) []string {
	var DataList []string
	// userInfo := FindMemberDB(params)
	// userProjectList := GetDBProjectList(params, userInfo.ObjectId, "projectOwner")
	fmt.Println("params : ", params)
	if params.Workspace == "" && params.Cluster == "" && params.Project == "" {
		fmt.Println("#################ALL List")
		Clusters := ListClusterDB("cluster")
		for c, _ := range Clusters {
			params.Cluster = Clusters[c].Name
			params.Workspace = Clusters[c].Name
			getData, err := common.DataRequest(params)

			if err != nil {
				fmt.Println("###########err : ", err)
				continue
			}
			getData0 := gjson.Get(getData, "items").Array()
			for k, _ := range getData0 {

				str := getData0[k].String()
				namespace := gjson.Get(str, "metadata.namespace")
				params.Project = namespace.String()
				projectCheck := GetDBProject(params)
				params.Name = ""
				strVal, _ := sjson.Set(str, "clusterName", Clusters[c].Name)
				strVal2, _ := sjson.Set(strVal, "workspaceName", projectCheck.Workspace.Name)
				strVal3, _ := sjson.Set(strVal2, "userName", projectCheck.MemberName)
				DataList = append(DataList, strVal3)

			}
		}
		return DataList
	} else if params.Workspace == "" && params.Cluster != "" && params.Project == "" {
		fmt.Println("#################Cluster List")
		getData, _ := common.DataRequest(params)
		getData0 := gjson.Get(getData, "items").Array()
		for k, _ := range getData0 {
			str := getData0[k].String()
			namespace := gjson.Get(str, "metadata.namespace")
			params.Project = namespace.String()
			projectCheck := GetDBProject(params)
			params.Name = ""
			strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
			strVal2, _ := sjson.Set(strVal, "workspaceName", projectCheck.Workspace.Name)
			strVal3, _ := sjson.Set(strVal2, "userName", projectCheck.MemberName)
			DataList = append(DataList, strVal3)
		}
		return DataList
	} else if params.Workspace != "" && params.Cluster == "" && params.Project == "" {
		fmt.Println("#################Workspace List")
		Workspace := GetDBWorkspace(params)
		objectID := Workspace.ObjectID
		Projects := GetDBList(params, "project", objectID, "workspace")
		for _, Project := range Projects {
			params.Project = common.InterfaceToString(Project["projectName"])
			// fmt.Println("[#####params]", params)
			Clusters := GetDBProject(params).Selectcluster
			// fmt.Println("[#####Clusters]", GetDBProject(params).Selectcluster)
			for c := range Clusters {
				params.Cluster = Clusters[c].Name
				getData, _ := common.DataRequest(params)
				getData0 := gjson.Get(getData, "items").Array()
				for k, _ := range getData0 {
					// fmt.Println("[#####getData0[k]]", getData0[k])
					str := getData0[k].String()
					strVal, _ := sjson.Set(str, "clusterName", Clusters[c].Name)
					strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
					strVal3, _ := sjson.Set(strVal2, "userName", GetDBProject(params).MemberName)
					DataList = append(DataList, strVal3)
				}
			}
		}
		return DataList
	} else if params.Project != "" && params.Workspace != "" {
		fmt.Println("#################Project List")
		project := GetDBProject(params)
		Clusters := project.Selectcluster
		for c, _ := range Clusters {
			params.Cluster = Clusters[c].Name
			getData, _ := common.DataRequest(params)
			getData0 := gjson.Get(getData, "items").Array()
			for k, _ := range getData0 {
				str := getData0[k].String()
				strVal, _ := sjson.Set(str, "clusterName", Clusters[c].Name)
				strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
				strVal3, _ := sjson.Set(strVal2, "userName", GetDBProject(params).MemberName)
				DataList = append(DataList, strVal3)
			}

		}
		return DataList
	} else if params.Project != "" && params.Name != "" {
		fmt.Println("#################Project Name List")
		Clusters := ListClusterDB("cluster")
		for c, _ := range Clusters {
			params.Cluster = Clusters[c].Name
			getData, _ := common.DataRequest(params)
			// fmt.Println("#################getData : ", getData)
			// getData0 := gjson.Get(getData, "items").Array()
			// for k, _ := range getData0 {
			// str := getData.String()
			strVal, _ := sjson.Set(getData, "clusterName", Clusters[c].Name)
			// strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
			// strVal3, _ := sjson.Set(strVal2, "userName", GetDBProject(params).MemberName)
			DataList = append(DataList, strVal)

		}
		return DataList
		// 	} else {
		// 		workspace := GetDBWorkspace(params)
		// 		selectCluster := workspace.SelectCluster
		// 		slice := strings.Split(selectCluster, ",")
		// 		fmt.Println("#############slice : %s", slice)
		// 		for w, _ := range slice {
		// 			params.Cluster = slice[w]
		// 			getData, _ := common.DataRequest(params)
		// 			getData0 := gjson.Get(getData, "items").Array()

		// 			for k, _ := range getData0 {
		// 				str := getData0[k].String()
		// 				if params.Kind == "persistentvolumes" || params.Kind == "persistentvolumeclaims" {
		// 					strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
		// 					strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
		// 					DataList = append(DataList, strVal2)
		// 				} else {
		// 					params.Name = gjson.Get(str, "metadata.namespace").String()
		// 					projectType := common.InterfaceToString(GetDBProject(params).Type)
		// 					// fmt.Println("[#####projectType]", projectType)
		// 					params.Name = ""
		// 					if projectType == "user" {
		// 						strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
		// 						strVal2, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
		// 						DataList = append(DataList, strVal2)
		// 					}
		// 				}
		// 			}
		// 		}
		// 		return DataList
		// 	}

		// } else if params.Project != "" && params.Workspace != "" {
		// 	fmt.Println("#################Project List")
		// 	if params.Workspace == "system" {
		// 		Clusters := GetAllDBClusters(params)
		// 		for c, _ := range Clusters {
		// 			params.Cluster = Clusters[c].Name
		// 			getData, _ := common.DataRequest(params)
		// 			getData0 := gjson.Get(getData, "items").Array()
		// 			for k, _ := range getData0 {
		// 				str := getData0[k].String()
		// 				strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
		// 				strVal2, _ := sjson.Set(strVal, "clusterName", params.Workspace)
		// 				DataList = append(DataList, strVal2)
		// 			}

		// 		}
		// 		return DataList
		// 	} else {
		// 		params.Name = params.Project
		// 		project := GetDBProject(params)
		// 		params.Name = ""
		// 		if project.Type == "user" {
		// 			selectCluster := project.SelectCluster
		// 			slice := strings.Split(selectCluster, ",")
		// 			for w, _ := range slice {
		// 				params.Cluster = slice[w]
		// 				// fmt.Printf("#################clusterName:%s\n", params.Cluster)
		// 				getData, _ := common.DataRequest(params)
		// 				getData0 := gjson.Get(getData, "items").Array()
		// 				// getData0 := common.FindingArray(common.Finding(getData, "items"))
		// 				for k, _ := range getData0 {
		// 					str := getData0[k].String()
		// 					strVal, _ := sjson.Set(str, "clusterName", slice[w])
		// 					strVal1, _ := sjson.Set(strVal, "workspaceName", params.Workspace)
		// 					strVal2, _ := sjson.Set(strVal1, "clusterName", params.Cluster)
		// 					DataList = append(DataList, strVal2)
		// 				}
		// 			}
		// 			return DataList
		// 		}
		// 	}

		// 	// project := GetDBProject(params)
		// 	// if project.Type == "user" {
		// 	// 	fmt.Println("#################user project")
		// 	// 	if project.WorkspaceName != params.Workspace {
		// 	// 		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrNotFound)
		// 	// 		DataList = append(DataList, common.InterfaceToString(msg))
		// 	// 		return DataList
		// 	// 	}
		// 	// 	selectCluster := project.SelectCluster
		// 	// 	slice := strings.Split(selectCluster, ",")
		// 	// 	for w, _ := range slice {
		// 	// 		params.Cluster = slice[w]
		// 	// 		// fmt.Printf("#################clusterName:%s\n", params.Cluster)
		// 	// 		getData, _ := common.DataRequest(params)
		// 	// 		getData0 := gjson.Get(getData, "items").Array()
		// 	// 		// getData0 := common.FindingArray(common.Finding(getData, "items"))
		// 	// 		for k, _ := range getData0 {
		// 	// 			str := getData0[k].String()
		// 	// 			strVal, _ := sjson.Set(str, "clusterName", slice[w])
		// 	// 			DataList = append(DataList, strVal)
		// 	// 		}
		// 	// 	}
		// 	// 	return DataList
		// 	// }
		// 	// workspace := GetDBWorkspace(params)
		// 	// selectCluster := workspace.SelectCluster
		// 	// slice := strings.Split(selectCluster, ",")
		// 	// for w, _ := range slice {
		// 	// 	params.Cluster = slice[w]
		// 	// 	// params.Name = ""
		// 	// 	params.Kind = staticKind
		// 	// 	getData, _ := common.DataRequest(params)
		// 	// 	getData0 := common.FindingArray(common.Finding(getData, "items"))
		// 	// 	for k, _ := range getData0 {
		// 	// 		str := getData0[k].String()
		// 	// 		strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
		// 	// 		DataList = append(DataList, strVal)
		// 	// 	}
		// 	// 	// DataList = append(DataList, getData0)
		// 	// }
		// 	// }
		// 	// return DataList

		// } else if params.Project != "" && params.Cluster != "" {
		// 	fmt.Println("#################Project in Cluster List")
		// 	// params.Workspace = params.Cluster
		// 	getData, _ := common.DataRequest(params)
		// 	getData0 := gjson.Get(getData, "items").Array()
		// 	// getData0 := common.FindingArray(common.Finding(getData, "items"))
		// 	for k, _ := range getData0 {
		// 		str := getData0[k].String()
		// 		strVal, _ := sjson.Set(str, "clusterName", params.Cluster)
		// 		DataList = append(DataList, strVal)
		// 	}

		// 	return DataList

	}
	return nil

}
