package controller

import (
	"context"
	"errors"
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
	cdb := GetWorkspaceDB("request")
	cdb2 := GetProjectDB("member")
	cdb3 := GetProjectDB("workspace")
	cdb4 := GetProjectDB("project")
	
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	models := new(model.Request)
	validate := validator.New()
	// log.Println("workspaceBody : ", responseBody(c.Request().Body))
	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}
	if err = validate.Struct(models); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			log.Fatal(err)
		}
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return
	}

	// log.Fatal(checkModel)
	// log.Fatal(models.Name)
	// log.Fatal(FindWorkspaceDB(models.Name))
	// if FindWorkspaceDB(models.Name) !=nil {
	// 	log.Fatal("test")
	// 	common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
	// 	return
	// }
	// log.Fatal("test2")
	log.Println("model: " , models)
	memberInfo, err := cdb2.Find(ctx, bson.M{"memberId": models.MemberName})
	workspaceInfo, err := cdb3.Find(ctx, bson.M{"workspaceName": models.WorkspaceName})
	projectInfo, err := cdb4.Find(ctx, bson.M{"projectName": models.ProjectName})

	// checkModel := model.Workspace{}
	// if err := cdb.FindOne(ctx, bson.M{"workspaceName": models.Name}).Decode(&checkModel); err == nil {
	// 	common.ErrorMsg(c, http.StatusUnprocessableEntity, common.ErrDuplicated)
	// 	return nil
	// }
	// for i := 0; i < len(models.ClusterName); i++ {
	// 	clusterObjectId3, _ = cdb3.Find(ctx, bson.M{"clusterName": models.ClusterName[i]})
	// 	clusterObjectId3.All(ctx, &clusterObjectId2)
	// 	slice = append(slice, clusterObjectId2[0][0].Value.(primitive.ObjectID))
	// }

	// if err = memberObjectId.All(ctx, &memberObjectId2); err != nil {
	// 	log.Fatal(err)
	// }

	if err = validate.Struct(models); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			log.Fatal(err)
		}
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return
	}
	if err != nil {
		log.Fatal(err)
	}


	var memberObjectId []bson.D
	var workspaceObjectId []bson.D
	var projectObjectId []bson.D
	if err = memberInfo.All(ctx, &memberObjectId); err != nil {
			log.Fatal(err)
	}
	log.Println("memberObjectId : ", memberInfo)
	if err = workspaceInfo.All(ctx, &workspaceObjectId); err != nil {
		log.Fatal(err)
	}
	if err = projectInfo.All(ctx, &projectObjectId); err != nil {
		log.Fatal(err)
	}
	// uuid := uuid.New()
	newRequest := model.NewRequest{
		Id:          models.Id,
		Status: models.Status,
		Workspace:  workspaceObjectId[0][0].Value.(primitive.ObjectID),
		Project:  projectObjectId[0][0].Value.(primitive.ObjectID),
		Creator: memberObjectId[0][0].Value.(primitive.ObjectID),
		Name:         models.Name,
		Type:       models.Type,
	}

	newRequest.Created_at = time.Now()
	result, err := cdb.InsertOne(ctx, newRequest)
	if err != nil {
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return nil
	}

	return c.JSON(http.StatusCreated, echo.Map{
		"status": "Created",
		"code":   http.StatusCreated,
		"data":   result,
	})
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
		// fmt.Println("request : ", request)
		// fmt.Println("tmp_request : ", tmp_request)
		var project model.NewProject
		cdb2 := GetRequestDB("project")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		if err := cdb2.FindOne(ctx, bson.M{"_id": tmp_request.Project}).Decode(&project); err != nil {

		}
		params.Project = project.Name
		tmp_project := GetDBProject(params)
		// fmt.Println("request : ", request)
		// cluster := GetDB("cluster", tmp_request.Cluster, "_id")
		member := GetDB("member", request["requestCreator"], "_id")
		// fmt.Println("member : ", member)
		result := model.DBRequest{
			ObjectID:   request["_id"],
			Id:         tmp_request.Id,
			Status:     tmp_request.Status,
			// Message:    tmp_request.Message,
			Workspace:  tmp_project.Workspace.Name,
			Project:    project.Name,
			// Date:       tmp_request.Date,
			// Cluster:    common.InterfaceToString(cluster["clusterName"]),
			Name:       tmp_request.Name,
			// Reason:     tmp_request.Reason,
			Type:       tmp_request.Type,
			MemberName: common.InterfaceToString(member["memberId"]),
		}
		results = append(results, result)
	}

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
		lookupCluster := bson.D{{Key: "$lookup", Value: bson.D{{Key: "from", Value: "cluster"}, {Key: "localField", Value: "cluster"}, {Key: "foreignField", Value: "_id"}, {Key: "as", Value: "cluster"}}}}
		lookupWorkspace := bson.D{{Key: "$lookup", Value: bson.D{{Key: "from", Value: "workspace"}, {Key: "localField", Value: "workspace"}, {Key: "foreignField", Value: "_id"}, {Key: "as", Value: "workspace"}}}}
		lookupProject := bson.D{{Key: "$lookup", Value: bson.D{{Key: "from", Value: "project"}, {Key: "localField", Value: "project"}, {Key: "foreignField", Value: "_id"}, {Key: "as", Value: "project"}}}}
		matchCluster := bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "request_id", Value: search_val},
			}},
		}

		showLoadedCursor, err := cdb.Aggregate(ctx, mongo.Pipeline{lookupCluster, lookupWorkspace, lookupProject, matchCluster})

		if err = showLoadedCursor.All(ctx, &showsRequest); err != nil {
			log.Println(err)
		}
		// fmt.Println(showsRequest)
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
			log.Println(err)
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

	// fmt.Println(update)

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
		log.Printf("Error : %s\n", err)
	}
	return x
}
