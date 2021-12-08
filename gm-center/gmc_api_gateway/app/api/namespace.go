package api

// import (
// 	"bytes"
// 	"crypto/tls"
// 	"encoding/json"
// 	"fmt"
// 	"gmc_api_gateway/app/common"
// 	"gmc_api_gateway/app/db"
// 	"gmc_api_gateway/app/model"
// 	"io/ioutil"
// 	"net/http"
// 	"strings"

// 	"github.com/labstack/echo/v4"
// )

// // type Namespace struct {
// // 	APIVersion string `json:"apiVersion"`
// // 	Kind       string `json:"kind"`
// // 	Metadata   struct {
// // 		Name string `json:"name"`
// // 	} `json:"metadata"`
// // 	Spec struct {
// // 	} `json:"spec"`
// // 	Status struct {
// // 	} `json:"status"`
// // }

// //프로젝트 생성
// func CreateProjects(c echo.Context) (err error) {

// 	err, models := CreateProjectDB(c)

// 	if err != nil {
// 		return err
// 	}

// 	selectCluster := models.SelectCluster
// 	slice := strings.Split(selectCluster, ",")

// 	for _, cluster := range slice {

// 		clusters := GetCluster3(cluster)

// 		namesapce := Namespace{}
// 		namesapce.APIVersion = "v1"
// 		namesapce.Kind = "Namespace"
// 		namesapce.Metadata.Name = models.Name

// 		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/"
// 		Token := clusters.Token

// 		data, err := json.Marshal(namesapce)

// 		if err != nil {
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}

// 		var jsonStr = []byte(fmt.Sprint(string(data)))

// 		code, _ := RequsetKube(url, "POST", jsonStr, Token)

// 		switch code {
// 		case 200:
// 		case 201:
// 		case 202:
// 		default:
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}
// 	}

// 	return nil
// }

// //프로젝트 전체 업데이트
// func UpdateProjectsPUT(c echo.Context) (err error) {

// 	name := c.Param("name")
// 	if check := strings.Compare(name, "") == 0; check {
// 		common.ErrorMsg(c, http.StatusBadRequest, err)
// 		return err
// 	}

// 	models := GetProjectModel(name)
// 	selectCluster := models.SelectCluster
// 	slice := strings.Split(selectCluster, ",")

// 	for _, cluster := range slice {
// 		clusters := GetCluster3(cluster)

// 		namesapce := Namespace{}

// 		//put 요청시 Body 내용에 대해 수정이 필요함.
// 		namesapce.APIVersion = "v1"
// 		namesapce.Kind = "Namespace"
// 		namesapce.Metadata.Name = models.Name

// 		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/" + name
// 		Token := clusters.Token

// 		data, err := json.Marshal(namesapce)

// 		if err != nil {
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}

// 		var jsonStr = []byte(fmt.Sprint(string(data)))

// 		code, _ := RequsetKube(url, "PATCH", jsonStr, Token)

// 		switch code {
// 		case 200:
// 		case 201:
// 		default:
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}
// 	}
// 	return nil
// }

// //프로젝트 부분 업데이트
// func UpdateProjectsPATCH(c echo.Context) (err error) {

// 	name := c.Param("name")
// 	if check := strings.Compare(name, "") == 0; check {
// 		common.ErrorMsg(c, http.StatusBadRequest, err)
// 		return err
// 	}

// 	models := GetProjectModel(name)
// 	selectCluster := models.SelectCluster
// 	slice := strings.Split(selectCluster, ",")

// 	for _, cluster := range slice {
// 		clusters := GetCluster3(cluster)

// 		namesapce := Namespace{}

// 		//put 요청시 Body 내용에 대해 수정이 필요함.
// 		namesapce.APIVersion = "v1"
// 		namesapce.Kind = "Namespace"
// 		namesapce.Metadata.Name = models.Name

// 		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/" + name
// 		Token := clusters.Token

// 		data, err := json.Marshal(namesapce)

// 		if err != nil {
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}

// 		var jsonStr = []byte(fmt.Sprint(string(data)))

// 		code, _ := RequsetKube(url, "PATCH", jsonStr, Token)

// 		switch code {
// 		case 200:
// 		case 201:
// 		default:
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}
// 	}
// 	return nil
// }

// //프로젝트 삭제
// func DeleteProjects(c echo.Context) (err error) {
// 	name := c.Param("name")
// 	if check := strings.Compare(name, "") == 0; check {
// 		common.ErrorMsg(c, http.StatusBadRequest, err)
// 		return err
// 	}

// 	models := GetProjectModel(name)
// 	selectCluster := models.SelectCluster
// 	slice := strings.Split(selectCluster, ",")
// 	for _, cluster := range slice {
// 		clusters := GetCluster3(cluster)

// 		url := "https://" + clusters.Endpoint + ":6443/api/v1/namespaces/" + name
// 		Token := clusters.Token

// 		if err != nil {
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}

// 		code := RequsetKubeDelete(url, "DELETE", Token)

// 		switch code {
// 		case 200:
// 		case 202:
// 		default:
// 			common.ErrorMsg(c, http.StatusBadRequest, err)
// 			return err
// 		}
// 	}
// 	DeleteProjectDB(c)

// 	return nil
// }

// func RequsetKube(url string, method string, reqdata []byte, token string) (int, string) {

// 	client := &http.Client{}
// 	req, _ := http.NewRequest(method, url, bytes.NewBuffer(reqdata))

// 	req.Header.Add("Authorization", "Bearer "+token)
// 	req.Header.Add("Content-Type", "application/json")

// 	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

// 	res, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println(err)
// 		return 0, ""
// 	}
// 	defer res.Body.Close()

// 	body, err := ioutil.ReadAll(res.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 		return 0, ""
// 	}

// 	return res.StatusCode, string(body)
// }

// func RequsetKubeDelete(url string, method string, token string) int {

// 	client := &http.Client{}
// 	req, _ := http.NewRequest(method, url, nil)

// 	req.Header.Add("Authorization", "Bearer "+token)
// 	req.Header.Add("Content-Type", "application/json")

// 	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

// 	res, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println(err)
// 		return 500
// 	}

// 	return res.StatusCode
// }

// func GetCluster3(str string) *model.Cluster {
// 	search_val := str
// 	db := db.DbManager()
// 	models := FindClusterDB(db, "Name", search_val)

// 	return models
// }

// func GetProjectModel(str string) *model.Project {
// 	db := db.DbManager()
// 	models := FindProjectDB(db, "Name", str)

// 	return models
// }

// func DeleteProjectDB(c echo.Context) (err error) {
// 	db := db.DbManager()
// 	search_val := c.Param("name")
// 	// fmt.Println(search_val)

// 	if err := FindProjectDB(db, "Name", search_val); err == nil {
// 		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
// 		return nil
// 	}

// 	models := FindProjectDB(db, "Name", search_val)
// 	fmt.Println(models)
// 	if err := db.Delete(&models).Error; err != nil {
// 		common.ErrorMsg(c, http.StatusInternalServerError, err)
// 		return nil
// 	}

// 	return nil
// }

// func CreateProjectDB(c echo.Context) (err error, st *model.Project) {
// 	db := db.DbManager()
// 	models := new(model.Project)

// 	if err = c.Bind(models); err != nil {
// 		common.ErrorMsg(c, http.StatusBadRequest, err)
// 		return err, models
// 	}
// 	if err = c.Validate(models); err != nil {
// 		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
// 		return err, models
// 	}

// 	if check := strings.Compare(models.Name, "") == 0; check {
// 		common.ErrorMsg(c, http.StatusBadRequest, err)
// 		return err, models
// 	}

// 	if err != nil {
// 		panic(err)
// 	}

// 	if err := db.Create(&models).Error; err != nil {
// 		common.ErrorMsg(c, http.StatusExpectationFailed, err)
// 		return err, models
// 	}

// 	return nil, models
// }
