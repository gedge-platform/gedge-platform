package controller

import (
	"context"
	"encoding/json"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
)

type jwtCustomClaims struct {
	Id   string `json:"id"`
	Role string `json:"role"`
	jwt.StandardClaims
}

func GetJWTSecret() string {
	return os.Getenv("SIGNINGKEY")
}

func AuthenticateUser(id string, password string) (bool, string) {
	cdb := GetClusterDB("member")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	user := bson.M{}

	// idCheck := strings.Compare(id, "") != 0
	// passCheck := strings.Compare(password, "") != 0

	// log.Println("check is ", idCheck, passCheck)
	if err := cdb.FindOne(ctx, bson.M{"memberId": id}).Decode(&user); err != nil {
		return false, ""
	} else {
		log.Println("user : ", user)
		if password != user["password"] {
			return false, ""
		}
	}
	// if idCheck && passCheck {
	// 	if err := cdb.FindOne(ctx, bson.M{"memberId": id}).Decode(&user); err != nil {

	// 		return false, ""
	// 	}
	// 	if user["password"] != password {
	// 		return false, ""
	// 	}
	// 	// fmt.Println("user is : ", user)
	// }

	return true, common.InterfaceToString(user["memberRole"])
}

// GetCronjobs godoc
// @Summary Login
// @Description get JWT token
// @Param authBody body model.User true "User Info Body"
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.User
// @Header 200 {string} Token "qwerty"
// @Router /auth [post]
// @Tags Login
func LoginUser(c echo.Context) (err error) {

	var user model.User

	Body := responseBody(c.Request().Body)
	err = json.Unmarshal([]byte(Body), &user)
	if err != nil {
		c.String(http.StatusInternalServerError, "Invalid json provided")
		return
	}
	log.Println("Body Value is : ", user)
	log.Println("user email is : ", user.Id)
	log.Println("user password is : ", user.Password)

	loginResult, userRole := AuthenticateUser(user.Id, user.Password)

	if loginResult {
		accessToken, expire, err := generateAccessToken(user.Id, userRole)

		log.Println("accessToken is : ", accessToken)
		log.Println("expire is : ", expire)
		log.Println("err is : ", err)

		if err != nil {
			return c.JSON(http.StatusUnauthorized, err.Error())
		}
		log.Println("token is : ", accessToken)
		return c.JSON(http.StatusOK, echo.Map{
			"status":      200,
			"accessToken": accessToken,
			"userId":      user.Id,
		})
	}
	return c.JSON(http.StatusUnauthorized, false)
}

func generateAccessToken(userid string, userrole string) (string, time.Time, error) {

	expirationTime := time.Now().Add(time.Minute * 60)

	return generateToken(userid, userrole, expirationTime, []byte(GetJWTSecret()))
}

func generateToken(userid string, userrole string, expirationTime time.Time, secret []byte) (string, time.Time, error) {
	claims := &jwtCustomClaims{
		Id:   userid,
		Role: userrole,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", time.Now(), err
	}

	return tokenString, expirationTime, nil
}
