package controller

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"encoding/json"
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

func GetRequestDB(name string) *mongo.Collection {
	db := db.DbManager()
	cdb := db.Collection(name)

	return cdb
}

func CreateRequest(c echo.Context) (err error) {
	cdb := GetRequestDB("request")
	cdb2 := GetClusterDB("workspace")
	cdb3 := GetClusterDB("project")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	models := new(model.Request)
	validate := validator.New()

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}

	workspaceObjectId, err := cdb2.Find(ctx, bson.M{"workspaceName": models.WorkspaceName})
	projectObjectId, err := cdb3.Find(ctx, bson.M{"projectName": models.ProjectName})
	var workspaceObjectId2 []bson.D
	var projectObjectId2 []bson.D

	if err = workspaceObjectId.All(ctx, &workspaceObjectId2); err != nil {
		log.Fatal(err)
	}
	if err = projectObjectId.All(ctx, &projectObjectId2); err != nil {
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

	newRequest := model.NewRequest{
		Id:        models.Id,
		Status:    models.Status,
		Message:   models.Message,
		Name:      models.Name,
		Reason:    models.Reason,
		Type:      models.Type,
		Date:      models.Date,
		Cluster:   primitive.NewObjectID(),
		Workspace: workspaceObjectId2[0][0].Value.(primitive.ObjectID),
		Project:   projectObjectId2[0][0].Value.(primitive.ObjectID),
	}

	result, err := cdb.InsertOne(ctx, newRequest)
	if err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
		return nil
	}

	return c.JSON(http.StatusOK, result)
}

func ListRequest(c echo.Context) (err error) {
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
	var showsRequest []bson.M
	if params.User == "" {
		cdb := GetProjectDB("request")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		findOptions := options.Find()

		cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
		if err != nil {
			log.Fatal(err)
		}
		if err = cur.All(ctx, &showsRequest); err != nil {
			panic(err)
		}
		if err := cur.Err(); err != nil {
			log.Fatal(err)
		}

		cur.Close(context.TODO())
	} else {
		userObj := FindMemberDB(params)
		showsRequest = GetDBList(params, "request", userObj.ObjectId, "requestCreator")
	}

	var results []model.DBRequest
	for _, request := range showsRequest {
		var tmp_request model.NewRequest
		common.Transcode(request, &tmp_request)
		fmt.Println("request : ", request)
		fmt.Println("tmp_request : ", tmp_request)
		var project model.NewProject
		cdb2 := GetRequestDB("project")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		if err := cdb2.FindOne(ctx, bson.M{"_id": tmp_request.Project}).Decode(&project); err != nil {

		}
		params.Project = project.Name
		tmp_project := GetDBProject(params)
		fmt.Println("request : ", request)
		cluster := GetDB("cluster", tmp_request.Cluster, "_id")
		member := GetDB("member", request["requestCreator"], "_id")
		fmt.Println("member : ", member)
		result := model.DBRequest{
			ObjectID:   request["_id"],
			Id:         tmp_request.Id,
			Status:     tmp_request.Status,
			Message:    tmp_request.Message,
			Workspace:  tmp_project.Workspace.Name,
			Project:    project.Name,
			Date:       tmp_request.Date,
			Cluster:    common.InterfaceToString(cluster["clusterName"]),
			Name:       tmp_request.Name,
			Reason:     tmp_request.Reason,
			Type:       tmp_request.Type,
			MemberName: common.InterfaceToString(member["memberId"]),
		}
		results = append(results, result)
	}

	// var project model.NewProject
	// cdb2 := GetRequestDB("project")
	// ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	// if err := cdb2.FindOne(ctx, bson.M{"_id": showsRequest["project"]}).Decode(&project); err != nil {

	// }
	// findOptions := options.Find()

	// cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// for cur.Next(context.TODO()) {
	// 	lookupCluster := bson.D{{"$lookup", bson.D{{"from", "cluster"}, {"localField", "cluster"}, {"foreignField", "_id"}, {"as", "cluster"}}}}
	// 	lookupWorkspace := bson.D{{"$lookup", bson.D{{"from", "workspace"}, {"localField", "workspace"}, {"foreignField", "_id"}, {"as", "workspace"}}}}
	// 	lookupProject := bson.D{{"$lookup", bson.D{{"from", "project"}, {"localField", "project"}, {"foreignField", "_id"}, {"as", "project"}}}}

	// 	showProjectCursor, err := cdb.Aggregate(ctx, mongo.Pipeline{lookupCluster, lookupWorkspace, lookupProject})

	// 	if err = showProjectCursor.All(ctx, &showsRequest); err != nil {
	// 		panic(err)
	// 	}
	// }

	// if err := cur.Err(); err != nil {
	// 	log.Fatal(err)
	// }

	// cur.Close(context.TODO())

	return c.JSON(http.StatusOK, results)
}

func FindRequest(c echo.Context) (err error) {
	var showsRequest []bson.M
	cdb := GetRequestDB("request")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("requestId")

	findOptions := options.Find()

	cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	for cur.Next(context.TODO()) {
		lookupCluster := bson.D{{"$lookup", bson.D{{"from", "cluster"}, {"localField", "cluster"}, {"foreignField", "_id"}, {"as", "cluster"}}}}
		lookupWorkspace := bson.D{{"$lookup", bson.D{{"from", "workspace"}, {"localField", "workspace"}, {"foreignField", "_id"}, {"as", "workspace"}}}}
		lookupProject := bson.D{{"$lookup", bson.D{{"from", "project"}, {"localField", "project"}, {"foreignField", "_id"}, {"as", "project"}}}}
		matchCluster := bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "request_id", Value: search_val},
			}},
		}

		showLoadedCursor, err := cdb.Aggregate(ctx, mongo.Pipeline{lookupCluster, lookupWorkspace, lookupProject, matchCluster})

		if err = showLoadedCursor.All(ctx, &showsRequest); err != nil {
			panic(err)
		}
		fmt.Println(showsRequest)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.TODO())

	if showsRequest == nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Request not found."))
		return
	} else {
		return c.JSON(http.StatusOK, showsRequest)
	}
}

func DeleteRequest(c echo.Context) (err error) {
	cdb := GetRequestDB("request")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("requestId")

	result, err := cdb.DeleteOne(ctx, bson.M{"request_id": search_val})
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to delete."))
		return
	}
	if result.DeletedCount == 0 {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Request not found."))
		return
	} else {
		return c.JSON(http.StatusOK, echo.Map{
			"status": http.StatusOK,
			"data":   search_val + " Deleted Complete",
		})
	}
}

func UpdateRequest(c echo.Context) (err error) {
	cdb := GetRequestDB("request")
	cdb2 := GetRequestDB("cluster")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("requestId")

	models := new(model.RequestUpdate)
	validate := validator.New()

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}
	var clusterObjectId2 []bson.D

	clusterObjectId, err := cdb2.Find(ctx, bson.M{"clusterName": models.ClusterName})

	if err = clusterObjectId.All(ctx, &clusterObjectId2); err != nil {
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
	switch models.ClusterName {
	case "":
		update = bson.M{"status": models.Status, "reason": models.Reason, "date": models.Date}
	default:
		update = bson.M{"status": models.Status, "reason": models.Reason, "date": models.Date, "code": models.Code, "cluster": clusterObjectId2[0][0].Value.(primitive.ObjectID)}
	}

	fmt.Println(update)

	result, err := cdb.UpdateOne(ctx, bson.M{"request_id": search_val}, bson.M{"$set": update})
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to update."))
		return
	}

	if result.MatchedCount == 1 {
		if err := cdb.FindOne(ctx, bson.M{"request_id": search_val}).Decode(&cdb); err != nil {
			common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to match Request."))
			return nil
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"status": http.StatusOK,
		"data":   search_val + " Updated Complete",
	})
}

func StringToInterface(i string) interface{} {
	var x interface{}
	if err := json.Unmarshal([]byte(i), &x); err != nil {
		fmt.Printf("Error : %s\n", err)
	}
	return x
}
