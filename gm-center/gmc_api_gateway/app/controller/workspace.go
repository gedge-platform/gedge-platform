package controller

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"gmc_api_gateway/app/common"
	db "gmc_api_gateway/app/database"
	"gmc_api_gateway/app/model"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetWorkspaceDB(name string) *mongo.Collection {
	db := db.DbManager()
	cdb := db.Collection(name)

	return cdb
}

// Create workspace godoc
// @Summary Create workspace
// @Description Create workspace
// @Param body body model.Workspace true "workspace Info Body"
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Workspace
// @Header 200 {string} Token "qwerty"
// @Router /workspaces [post]
// @Tags Workspace
func CreateWorkspace(c echo.Context) (err error) {
	cdb := GetWorkspaceDB("workspace")
	cdb2 := GetProjectDB("member")
	cdb3 := GetProjectDB("cluster")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	models := new(model.Workspace)
	validate := validator.New()

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}

	memberObjectId, err := cdb2.Find(ctx, bson.M{"memberName": models.MemberName})

	var clusterObjectId2 []bson.D
	var clusterObjectId3 *mongo.Cursor
	var memberObjectId2 []bson.D
	var slice []primitive.ObjectID

	for i := 0; i < len(models.ClusterName); i++ {
		clusterObjectId3, _ = cdb3.Find(ctx, bson.M{"clusterName": models.ClusterName[i]})
		clusterObjectId3.All(ctx, &clusterObjectId2)
		slice = append(slice, clusterObjectId2[0][0].Value.(primitive.ObjectID))
	}

	if err = memberObjectId.All(ctx, &memberObjectId2); err != nil {
		log.Fatal(err)
	}

	if err = validate.Struct(models); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			fmt.Println(err)
		}
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return
	}
	if err != nil {
		log.Fatal(err)
	}

	newWorkspace := model.NewWorkspace{
		Name:          models.Name,
		Description:   models.Description,
		Owner:         memberObjectId2[0][0].Value.(primitive.ObjectID),
		Creator:       memberObjectId2[0][0].Value.(primitive.ObjectID),
		Selectcluster: slice,
	}
	models.Created_at = time.Now()
	result, err := cdb.InsertOne(ctx, newWorkspace)
	if err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
		return nil
	}

	return c.JSON(http.StatusCreated, echo.Map{
		"status": "Created",
		"code":   http.StatusCreated,
		"data":   result,
	})
}

// GetAllworkspace godoc
// @Summary Show List workspace
// @Description get workspace List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Workspace
// @Security Bearer
// @Router /workspaces [get]
// @Param user query string false "user name of the workspace Owner"
// @Tags Workspace
func ListWorkspace(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "namespaces",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	var showsWorkspace []bson.M
	var Workspace []model.DBWorkspace

	if params.User == "" {

		cdb := GetWorkspaceDB("workspace")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

		findOptions := options.Find()

		cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
		if err != nil {
			log.Fatal(err)
		}
		if err = cur.All(ctx, &showsWorkspace); err != nil {
			panic(err)
		}
		// for cur.Next(context.TODO()) {
		// 	lookupCluster := bson.D{{"$lookup", bson.D{{"from", "cluster"}, {"localField", "selectCluster"}, {"foreignField", "_id"}, {"as", "selectCluster"}}}}

		// 	fmt.Println("ttt : ", mongo.Pipeline{lookupCluster})
		// 	showWorkspaceCursor, err := cdb.Aggregate(ctx, mongo.Pipeline{lookupCluster})

		// 	if err = showWorkspaceCursor.All(ctx, &showsWorkspace); err != nil {
		// 		panic(err)
		// 	}
		// }

		if err := cur.Err(); err != nil {
			log.Fatal(err)
		}

		cur.Close(context.TODO())
	} else {
		userObj := FindMemberDB(params)
		if userObj.Name == "" {
			common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found User"))
			return
		}
		showsWorkspace = GetDBList(params, "workspace", userObj.ObjectId, "workspaceOwner")
	}
	for _, workspace := range showsWorkspace {
		params.Workspace = common.InterfaceToString(workspace["workspaceName"])
		temp_workspace := GetDBWorkspace(params)
		Workspace = append(Workspace, temp_workspace)
	}
	return c.JSON(http.StatusOK, echo.Map{"data": Workspace})
}

// Getworkspace godoc
// @Summary Show detail workspace
// @Description get workspace Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the workspace"
// @Router /workspace/{name} [get]
// @Tags Workspace
func FindWorkspace(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "namespaces",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	var deployment_count int
	var daemonset_count int
	var Statefulset_count int
	var pod_count int
	var service_count int
	var cronjob_count int
	var job_count int
	var volume_count int
	var cpu_usage float64
	var memory_usage float64
	var List []model.EVENT
	var EventList []model.EVENT
	params.Workspace = params.Name
	workspace := GetDBWorkspace(params)
	if workspace.Name == "" {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found Workspace"))
		return
	}
	var Workspace model.Workspace_detail
	var projectList []model.Workspace_project
	Workspace.DBWorkspace = workspace
	projects := GetDBList(params, "project", workspace.ObjectID, "workspace")
	for _, project := range projects {
		params.Project = common.InterfaceToString(project["projectName"])
		tmp_project := GetDBProject(params)
		params.Name = common.InterfaceToString(project["projectName"])
		for _, cluster := range tmp_project.Selectcluster {
			params.Cluster = cluster.Name
			events := getCallEvent(params)
			if len(events) > 0 {
				List = append(List, events...)
			}
		}
		// resourceCnt2, resourceUsage, eventList := GetUserProjectResource(params, tmp_project.Selectcluster)
		// fmt.Println("resourceCnt : ", resourceCnt2)
		// fmt.Println("resourceUsage : ", resourceUsage)
		EventList = append(EventList, List...)
		// EventList = EventList + common.InterfaceToString(eventList)
		project := model.Workspace_project{
			Name:          tmp_project.Name,
			SelectCluster: tmp_project.Selectcluster,
			CreateAt:      tmp_project.Created_at,
			Creator:       tmp_project.MemberName,
		}
		projectList = append(projectList, project)
		deployment_count += resourceCnt(params.Project, params.Kind, "deployment_count")
		daemonset_count += resourceCnt(params.Project, params.Kind, "daemonset_count")
		Statefulset_count += resourceCnt(params.Project, params.Kind, "statefulset_count")
		pod_count += resourceCnt(params.Project, params.Kind, "pod_count")
		service_count += resourceCnt(params.Project, params.Kind, "service_count")
		cronjob_count += resourceCnt(params.Project, params.Kind, "cronjob_count")
		job_count += resourceCnt(params.Project, params.Kind, "job_count")
		volume_count += resourceCnt(params.Project, params.Kind, "pv_count")
		metric_result := make(map[string]interface{})
		tempMetric := []string{"namespace_cpu", "namespace_memory", "pod_running"}
		tempresult := NowMonit("workspace", "", params.Project, tempMetric)
		common.Transcode(tempresult, &metric_result)
		cpu_usage += common.InterfaceToFloat(metric_result["namespace_cpu"])
		memory_usage += common.InterfaceToFloat(metric_result["namespace_memory"])
	}
	ResourceUsage := model.Resource_usage{
		Namespace_cpu:    common.ToFixed(cpu_usage, 3),
		Namespace_memory: common.ToFixed(memory_usage, 3),
	}
	ResourceCnt := model.Resource_cnt{
		DeploymentCount:  deployment_count,
		DaemonsetCount:   daemonset_count,
		StatefulsetCount: Statefulset_count,
		PodCount:         pod_count,
		ServiceCount:     service_count,
		CronjobCount:     cronjob_count,
		JobCount:         job_count,
		VolumeCount:      volume_count,
	}
	Workspace.ProjectList = projectList
	Workspace.Resource = ResourceCnt
	Workspace.ResourceUsage = ResourceUsage
	Workspace.Events = EventList
	// cdb := GetWorkspaceDB("workspace")
	// ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	// search_val := c.Param("workspaceName")

	// findOptions := options.Find()

	// cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// for cur.Next(context.TODO()) {
	// 	lookupCluster := bson.D{{"$lookup", bson.D{{"from", "cluster"}, {"localField", "selectCluster"}, {"foreignField", "_id"}, {"as", "selectCluster"}}}}
	// 	matchCluster := bson.D{
	// 		{Key: "$match", Value: bson.D{
	// 			{Key: "workspaceName", Value: search_val},
	// 		}},
	// 	}

	// 	showLoadedCursor, err := cdb.Aggregate(ctx, mongo.Pipeline{lookupCluster, matchCluster})

	// 	if err = showLoadedCursor.All(ctx, &showsWorkspace); err != nil {
	// 		panic(err)
	// 	}
	// 	fmt.Println(showsWorkspace)
	// }

	// if err := cur.Err(); err != nil {
	// 	log.Fatal(err)
	// }

	// cur.Close(context.TODO())

	// if showsWorkspace == nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, errors.New("Workspace not found."))
	// 	return
	// } else {
	// 	return
	// }
	return c.JSON(http.StatusOK, Workspace)
}

func DeleteWorkspace(c echo.Context) (err error) {
	cdb := GetWorkspaceDB("workspace")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("workspaceName")

	result, err := cdb.DeleteOne(ctx, bson.M{"workspaceName": search_val})
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to delete."))
		return
	}
	if result.DeletedCount == 0 {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Workspace not found."))
		return
	} else {
		return c.JSON(http.StatusOK, echo.Map{
			"status": http.StatusOK,
			"data":   search_val + " Workspace Deleted Complete",
		})
	}
}

func UpdateWorkspace(c echo.Context) (err error) {
	cdb := GetWorkspaceDB("workspace")
	cdb2 := GetWorkspaceDB("cluster")
	cdb3 := GetWorkspaceDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("workspaceName")

	models := new(model.RequestWorkspace)
	validate := validator.New()

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}
	memberObjectId, err := cdb3.Find(ctx, bson.M{"memberName": models.MemberName})

	var clusterObjectId2 []bson.D
	var clusterObjectId3 *mongo.Cursor
	var memberObjectId2 []bson.D
	var slice []primitive.ObjectID

	for i := 0; i < len(models.ClusterName); i++ {
		clusterObjectId3, _ = cdb2.Find(ctx, bson.M{"clusterName": models.ClusterName[i]})
		clusterObjectId3.All(ctx, &clusterObjectId2)
		slice = append(slice, clusterObjectId2[0][0].Value.(primitive.ObjectID))
	}

	if err = memberObjectId.All(ctx, &memberObjectId2); err != nil {
		log.Fatal(err)
	}

	if err = validate.Struct(models); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			fmt.Println(err)
		}
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return
	}

	if err != nil {
		log.Fatal(err)
	}

	var update primitive.M
	// switch models.조건{
	// case nil :
	// update = bson.M{"workspaceOwner": memberObjectId2[0][0].Value.(primitive.ObjectID), "workspaceCreator": memberObjectId2[0][0].Value.(primitive.ObjectID), "workspaceDescription": models.Description, "selectCluster":slice}
	// default :
	update = bson.M{"workspaceOwner": memberObjectId2[0][0].Value.(primitive.ObjectID), "workspaceCreator": memberObjectId2[0][0].Value.(primitive.ObjectID), "workspaceDescription": models.Description, "selectCluster": slice}
	// }

	result, err := cdb.UpdateOne(ctx, bson.M{"workspaceName": search_val}, bson.M{"$set": update})
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to update."))
		return
	}

	if result.MatchedCount == 1 {
		if err := cdb.FindOne(ctx, bson.M{"workspaceName": search_val}).Decode(&cdb); err != nil {
			common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to match Workspace."))
			return nil
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"status": http.StatusOK,
		"data":   search_val + " Updated Complete",
	})
}

func GetDBWorkspace(params model.PARAMS) model.DBWorkspace {
	var workspace model.NewWorkspace
	var showsWorkspace model.DBWorkspace
	var clusters []model.Cluster
	var user model.Member
	// var workspace model.Workspace
	cdb := GetClusterDB("workspace")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := params.Workspace

	if err := cdb.FindOne(ctx, bson.M{"workspaceName": search_val}).Decode(&workspace); err != nil {

	}

	if err := cdb.FindOne(ctx, bson.M{"workspaceName": search_val}).Decode(&showsWorkspace); err != nil {

	}
	showsWorkspace.Created_at = workspace.Created_at
	user_objectId := workspace.Owner
	userList := GetClusterDB("member")
	users, _ := context.WithTimeout(context.Background(), time.Second*10)
	if err := userList.FindOne(users, bson.M{"_id": user_objectId}).Decode(&user); err != nil {
	}
	tempList := GetClusterDB("cluster")
	clusterList, _ := context.WithTimeout(context.Background(), time.Second*10)
	objectId := workspace.Selectcluster
	for i := range objectId {
		var cluster model.Cluster
		if err := tempList.FindOne(clusterList, bson.M{"_id": objectId[i]}).Decode(&cluster); err != nil {

		}
		clusters = append(clusters, cluster)
	}
	showsWorkspace.Selectcluster = clusters
	showsWorkspace.MemberName = user.Id
	// workspaceList := GetClusterDB("workspace")
	// workspaces, _ := context.WithTimeout(context.Background(), time.Second*10)
	// if err := workspaceList.FindOne(workspaces, bson.M{"_id": objectId}).Decode(&workspace); err != nil {

	// }
	// showsProject.Workspace = workspace
	return showsWorkspace
}
