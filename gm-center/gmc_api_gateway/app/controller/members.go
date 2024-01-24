package controller

import (
	"context"
	"encoding/json"
	"errors"
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

func GetMemberDB(name string) *mongo.Collection {
	db := db.DbManager()
	cdb := db.Collection(name)

	return cdb
}

// Create Member godoc
// @Summary Create Member
// @Description Create Member
// @Param body body model.Member true "Cluster Info Body"
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security Bearer
// @Success 200 {object} model.Error
// @Header 200 {string} Token "qwerty"
// @Router /members [post]
// @Tags User
func CreateMember(c echo.Context) (err error) {
	params := model.PARAMS{
		// Name:      c.Param("name"),
		// Cluster:   c.QueryParam("cluster"),
		// Workspace: c.QueryParam("workspace"),
		// Project:   c.QueryParam("project"),
		User: c.QueryParam("user"),
		// Method:    c.Request().Method,
		// Body:      responseBody(c.Request().Body),
	}

	cdb := GetMemberDB("member")

	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	models := new(model.RequestMember)
	validate := validator.New()

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

	if err != nil {
		log.Fatal(err)
	}
	params.User = models.Id
	memberCheck := FindMemberDB(params)
	if memberCheck.Id != "" {
		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrDuplicated)
		return c.JSON(http.StatusNotFound, echo.Map{
			"error": msg,
		})
	}
	models.Created_at = time.Now()
	result, err := cdb.InsertOne(ctx, models)
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

// GetAllMember godoc
// @Summary Show List Member
// @Description get Member List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Member
// @Security Bearer
// @Router /members [get]
// @Tags User
func ListMember(c echo.Context) (err error) {
	var results []model.Member
	cdb := GetMemberDB("member")

	findOptions := options.Find()

	cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}

	for cur.Next(context.TODO()) {
		var elem model.Member
		if err := cur.Decode(&elem); err != nil {
			log.Fatal(err)
		}
		elem.Password = "******"
		results = append(results, elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.TODO())

	return c.JSON(http.StatusOK, results)

}

// Get Member godoc
// @Summary Show detail Member
// @Description get Member Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Member
// @Security   Bearer
// @Param name path string true "name of the Member"
// @Router /members/{name} [get]
// @Tags User
func FindMember(c echo.Context) (err error) {
	var member model.Member
	cdb := GetMemberDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("memberId")

	if err := cdb.FindOne(ctx, bson.M{"memberId": search_val}).Decode(&member); err != nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Member not found."))
		return nil
	} else {
		member.Password = "******"
		return c.JSON(http.StatusOK, &member)
	}
}

// Delete User godoc
// @Summary Delete User
// @Description delete User
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Error
// @Security   Bearer
// @Router /members/{name} [delete]
// @Param name path string true "Name of the User"
// @Tags User
func DeleteMember(c echo.Context) (err error) {
	cdb := GetMemberDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("memberId")

	result, err := cdb.DeleteOne(ctx, bson.M{"memberId": search_val})
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to delete."))
		return
	}
	if result.DeletedCount == 0 {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Member not found."))
		return
	} else {
		return c.JSON(http.StatusOK, echo.Map{
			"status": http.StatusOK,
			"data":   search_val + " Member Deleted Complete",
		})
	}
}

func UpdateMember(c echo.Context) (err error) {
	params := model.PARAMS{
		// Name:      c.Param("name"),
		// Cluster:   c.QueryParam("cluster"),
		// Workspace: c.QueryParam("workspace"),
		// Project:   c.QueryParam("project"),
		User: c.QueryParam("user"),
		// Method:    c.Request().Method,
		Body: responseBody(c.Request().Body),
	}
	cdb := GetMemberDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := c.Param("memberId")

	params.User = c.Param("memberId")
	member := FindMemberDB(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	var body primitive.M
	json.Unmarshal([]byte(params.Body), &body)
	// common.Transcode(params.Body, &body)
	filter := bson.D{{"_id", member.ObjectId}}
	update := bson.D{{"$set", body}}

	result, err := cdb.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatal(err)
	}
	if result.MatchedCount == 1 {
		if err := cdb.FindOne(ctx, bson.M{"memberId": search_val}).Decode(&cdb); err != nil {
			common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to match Member."))
			return nil
		}
	}
	// models := new(model.RequestMember)
	// validate := validator.New()

	// if err = c.Bind(models); err != nil {
	// 	common.ErrorMsg(c, http.StatusBadRequest, err)
	// 	return nil
	// }

	// if err = validate.Struct(models); err != nil {
	// 	for _, err := range err.(validator.ValidationErrors) {
	// 		fmt.Println(err)
	// 	}
	// 	common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
	// 	return
	// }

	// if err != nil {
	// 	log.Fatal(err)
	// }

	// var update primitive.M

	// update = bson.M{"memberName": models.Name, "email": models.Email, "password": models.Password, "contact": models.Contact, "memberRole": models.RoleName}

	// result, err := cdb.UpdateOne(ctx, bson.M{"memberId": search_val}, bson.M{"$set": update})
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to update."))
	// 	return
	// }

	// if result.MatchedCount == 1 {
	// 	if err := cdb.FindOne(ctx, bson.M{"memberId": search_val}).Decode(&cdb); err != nil {
	// 		common.ErrorMsg(c, http.StatusNotFound, errors.New("failed to match Member."))
	// 		return nil
	// 	}
	// }
	return c.JSON(http.StatusOK, echo.Map{
		"status": http.StatusOK,
		"data":   search_val + " Updated Complete",
	})
}

func FindDBwithPW(select_val string, search_val string) *model.MemberWithPassword {
	var models model.MemberWithPassword
	cdb := GetMemberDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	if err := cdb.FindOne(ctx, bson.M{"memberId": search_val}).Decode(&models); err != nil {
		return nil
	} else if err := cdb.FindOne(ctx, bson.M{"memberName": search_val}).Decode(&models); err != nil {
		return nil
	}
	return &models
}

func FindMemberDB(params model.PARAMS) model.Member {
	var member model.Member
	cdb := GetClusterDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := params.User

	if err := cdb.FindOne(ctx, bson.M{"memberId": search_val}).Decode(&member); err != nil {
	}
	return member
}
