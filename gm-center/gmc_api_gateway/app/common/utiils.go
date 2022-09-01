package common

// import (
// 	"errors"
// 	"os"
// 	"strconv"

// 	"gmc_api_gateway/config"

// 	"github.com/gofrs/uuid"
// 	"github.com/labstack/echo/v4"
// )

// var (
// 	// common
// 	ErrNoData            = errors.New("No Data")
// 	ErrNotFound          = errors.New("Not Found")
// 	ErrClusterNotFound   = errors.New("Cluster Not Found")
// 	ErrWorkspaceNotFound = errors.New("Workspace Not Found")
// 	ErrWorkspaceInvalid  = errors.New("Workspace Empty")
// 	ErrProjectInvalid    = errors.New("Project Empty")
// 	ErrDetailNameInvalid = errors.New("Detail Name Empty")
// 	ErrClusterInvalid    = errors.New("Required Cluster Name")
// 	// Account
// 	ErrIdInvalid = errors.New("id is empty")
// 	ErrBodyEmpty = errors.New("Body is empty")
// )

// type messageFormat struct {
// 	StatusCode int    `json:"status_code"`
// 	Message    string `json:"message,omitempty"`
// }

// // Return Error Message
// func ErrorMsg(c echo.Context, status int, err error) {
// 	errMsg := messageFormat{
// 		StatusCode: status,
// 		Message:    err.Error(),
// 	}
// 	c.JSON(status, echo.Map{"error": errMsg})
// }

// // Environment Value ("LISTEN_PORT")
// func GetListenPort(config *config.Config) string {
// 	port := os.Getenv("LISTEN_PORT")

// 	if len(port) == 0 {
// 		port = config.COMMON.Port
// 	}
// 	intPort, err := strconv.Atoi(port)
// 	if err != nil || intPort < 1 || 65535 < intPort {
// 		port = config.COMMON.Port
// 	}

// 	return ":" + port
// }

// // String to Uint
// func ConvertStringToUint(data string) (uintData uint, err error) {
// 	u64, err := strconv.ParseUint(data, 10, 32)
// 	if err != nil {
// 		return
// 	}

// 	return uint(u64), nil
// }

// // String to Int
// func ConvertStringToInt(data string) (uintData int, err error) {
// 	u64, err := strconv.ParseUint(data, 10, 32)
// 	if err != nil {
// 		return
// 	}

// 	return int(u64), nil
// }

// // String to uuid.UUID
// func ConvertStringToUuid(data string) (uuidData uuid.UUID, err error) {
// 	uuid, err := uuid.FromString(data)
// 	if err != nil {
// 		return uuid, errors.New("failed to parse UUID")
// 	}

// 	return uuid, nil
// }
