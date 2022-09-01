package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"
	"os"
	"strings"
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

	idCheck := strings.Compare(id, "") != 0
	passCheck := strings.Compare(password, "") != 0

	if idCheck && passCheck {
		// fmt.Println("asfasdf")
		if err := cdb.FindOne(ctx, bson.M{"memberId": id}).Decode(&user); err != nil {

			return false, ""
		}
		if user["password"] != password {
			return false, ""
		}
		fmt.Println("user is : ", user)
	}

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
	// fmt.Println("Body is : ", Body)
	err = json.Unmarshal([]byte(Body), &user)
	if err != nil {
		c.String(http.StatusInternalServerError, "Invalid json provided")
		return
	}
	fmt.Println("Body Value is : ", user)
	fmt.Println("user email is : ", user.Id)
	fmt.Println("user password is : ", user.Password)

	loginResult, userRole := AuthenticateUser(user.Id, user.Password)

	// fmt.Println("loginResult is : ", loginResult)
	// fmt.Println("userRole is : ", userRole)

	if loginResult {
		accessToken, expire, err := generateAccessToken(user.Id, userRole)

		fmt.Println("accessToken is : ", accessToken)
		fmt.Println("expire is : ", expire)
		fmt.Println("err is : ", err)

		// cookieName := "gedgeAuth"

		// if cookieName != "" {
		// 	cookie := new(http.Cookie)
		// 	cookie.Name = cookieName
		// 	cookie.Value = accessToken
		// 	cookie.Expires = expire
		// 	c.SetCookie(cookie)
		// }

		if err != nil {
			return c.JSON(http.StatusUnauthorized, err.Error())
		}
		fmt.Println("token is : ", accessToken)
		return c.JSON(http.StatusOK, echo.Map{
			"status":      200,
			"accessToken": accessToken,
			// "userRole":    userRole,
			"userId": user.Id,
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

// func VerifyAccessToken(c echo.Context) (err error) {

// // }
// func JwtTokenProvider() {
// 	var secretKey
// 	var expiredMin
// }
