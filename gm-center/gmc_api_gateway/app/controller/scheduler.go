package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"
	"log"
	"github.com/labstack/echo/v4"
)

func PostScheduler(c echo.Context) (err error) {
	params := model.PARAMS{
		QueryString: c.QueryString(),
		Method:      c.Request().Method,
		Body:        responseBody(c.Request().Body),
	}

	// postData, err := common.DataRequest(params)
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// } else {
	// 	return c.JSON(http.StatusCreated, echo.Map{
	// 		"status": "Created",
	// 		"code":   http.StatusCreated,
	// 		"data":   postData,
	// 	})
	// }

	
	postData, err := common.DataRequest_scheduler(params)
	// deploy_check,_ := scheduler_check("kube_pod_labels{cluster='innogrid-k8s-master',namespace='testinno-649906ca06cc37d12d5645b5',pod='nginx14'}")
	// log.Println("deploy_check : ", deploy_check)

	if err != nil ||  common.StringToMapInterface(postData)["error"] != nil  {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"status": "error",
				"code":   http.StatusBadRequest,
				"data":   common.StringToMapInterface(postData)["error"],
			})
		} else {
			return c.JSON(http.StatusCreated, echo.Map{
			"status": "Created",
			"code":   http.StatusCreated,
			"data":   postData,
			})
		} 
		
	// if err != nil {
	// 	return c.JSON(http.StatusNotFound, echo.Map{
	// 		"status": "error",
	// 		"code":   http.StatusNotFound,
	// 		"data":   err,
	// 	})
	// } else {
	// 	if deploy_check != 0{
	// 	return c.JSON(http.StatusCreated, echo.Map{
	// 		"status": "Created",
	// 		"code":   http.StatusCreated,
	// 		"data":   postData,
	// 	})
	// } else {
	// 	return c.JSON(http.StatusNotFound, echo.Map{
	// 		"status": "error",
	// 		"code":   http.StatusNotFound,
	// 		"data":   err,
	// 	})
	// }
	// }
}

func CallbackScheduler(c echo.Context) (err error) {
	params := model.PARAMS{
		// QueryString: c.QueryString(),
		Method:      c.Request().Method,
		Body:        responseBody(c.Request().Body),
	}
log.Println("callback : ", params.Body)
		return c.JSON(http.StatusCreated, echo.Map{
			"err":   err,
			"data":  params.Body,
		})
	}
