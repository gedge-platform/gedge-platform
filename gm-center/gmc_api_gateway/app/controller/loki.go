package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"
	// "github.com/grafana/loki/pkg/promtail/client"
	"github.com/labstack/echo/v4"
)

func GetLogs(c echo.Context) (err error) {
	params := model.PARAMS{
		Cluster: c.QueryParam("cluster"),
		Query:   c.QueryParam("query"),
		Method:  c.Request().Method,
		Body:    responseBody(c.Request().Body),
	}

	cluster := GetDB_NAME("cluster", params.Cluster, "clusterName")
	endPoint := common.InterfaceToString(cluster["clusterEndpoint"])
	getData, err := common.DataRequest_Loki(endPoint, params.Query, params)
	if err != nil {
		// log.Println("getData1: ",getData)
		return c.JSON(http.StatusNotFound, echo.Map{
			"status": "error",
			"code":   http.StatusNotFound,
			"data":   err,
		})
	} else {
		// log.Println("getData2: ", getData)
		return c.JSON(http.StatusOK, common.StringToInterface(getData))
	}
}

// client, err := client.NewClient("http://101.79.1.138:31603")

// // Query Loki for logs
// entries, err := client.Query(context.Background(), &client.Query{
// 	Range: client.Range{
// 		Start: time.Now().Add(-time.Minute),
// 		End:   time.Now(),
// 	},
// 	Query: `{namespace="monitoring-system", instance=~"All"} |~ "level=warn"`,
// })
// if err != nil {
// 	panic(err)
// }

// Print the logs
