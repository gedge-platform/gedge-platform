package common

import (
	"errors"

	"github.com/labstack/echo/v4"
)

var (
	// common
	ErrNoData            = errors.New("No Data")
	ErrNotFound          = errors.New("Not Found")
	ErrClusterNotFound   = errors.New("Cluster Not Found")
	ErrWorkspaceNotFound = errors.New("Workspace Not Found")
	ErrProjectNotFound   = errors.New("Project Not Found")
	ErrMemberNotFound    = errors.New("Member Not Found")
	ErrWorkspaceInvalid  = errors.New("Workspace Empty")
	ErrProjectInvalid    = errors.New("Project Empty")
	ErrDetailNameInvalid = errors.New("Detail Name Empty")
	ErrClusterInvalid    = errors.New("Required Cluster Name")
	ErrDuplicated        = errors.New("Duplicated Data")
	ErrDuplicatedCheckOK = errors.New("Duplicate check OK")
	ErrTypeNotFound      = errors.New("Duplicate Type Empty")
	// Account
	ErrIdInvalid = errors.New("id is empty")
	ErrBodyEmpty = errors.New("Body is empty")
)

// Error Message
func ErrorMsg(c echo.Context, status int, err error) {
	errMsg := messageFormat{
		StatusCode: status,
		Message:    err.Error(),
	}
	c.JSON(status, echo.Map{"error": errMsg})
}

type messageFormat struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message,omitempty"`
}

func ErrorMsg2(status int, err error) *messageFormat {
	errMsg := messageFormat{
		StatusCode: status,
		Message:    err.Error(),
	}
	return &errMsg
}
