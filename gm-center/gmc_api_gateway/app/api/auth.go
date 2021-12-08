package api

import (
	"encoding/json"
	"fmt"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

type jwtCustomClaims struct {
	Name string `json:"name"`
	Role string `json:"role"`
	jwt.StandardClaims
}

func GetJWTSecret() string {
	return os.Getenv("SIGNINGKEY")
}

func AuthenticateUser(id, password string) (bool, string) {
	db := db.DbManager()
	var user model.MemberWithPassword

	idCheck := strings.Compare(id, "") != 0
	passCheck := strings.Compare(password, "") != 0

	if idCheck && passCheck {

		if err := db.First(&user, model.MemberWithPassword{Member: model.Member{Id: id}, Password: password}).Error; err == nil {
			return true, user.RoleName
		}

	}

	return false, ""
}

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
			"status":       200,
			"access-token": accessToken,
			"userRole":     userRole,
		})
	}
	return c.JSON(http.StatusUnauthorized, false)
}

func generateAccessToken(userid string, userrole string) (string, time.Time, error) {

	expirationTime := time.Now().Add(time.Minute * 15)

	return generateToken(userid, userrole, expirationTime, []byte(GetJWTSecret()))
}

func generateToken(userid string, userrole string, expirationTime time.Time, secret []byte) (string, time.Time, error) {
	claims := &jwtCustomClaims{
		Name: userid,
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

// }
