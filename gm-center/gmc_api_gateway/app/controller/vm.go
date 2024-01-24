package controller

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"gmc_api_gateway/app/common"
	db "gmc_api_gateway/app/database"
	"gmc_api_gateway/app/model"

	// "github.com/go-playground/validator"
	"github.com/labstack/echo/v4"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/gophercloud/gophercloud"
	// "github.com/gophercloud/gophercloud/pagination"
	"github.com/gophercloud/gophercloud/openstack"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/flavors"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/images"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/servers"
	// "github.com/tidwall/gjson"
)

type SystemId struct {
	SystemId string `json:"SystemId"`
}

type NameId struct {
	NameId string `json:"NameId"`
	Status string `json:"Status"`
}
type CredentialName struct {
	CredentialName string `json:"CredentialName"`
	ProviderName   string `json:"ProviderName"`
}
type vmParam struct {
	NameId     string `json:"NameId"`
	Status     string `json:"Status"`
	Provider   string `json:"Provider"`
	Credential string `json:"Credential"`
	Connection string `json:"Connection"`
}

func Conn(name string) *mongo.Collection {
	db := db.DbManager()
	cdb := db.Collection(name)

	return cdb
}

// GetCloudOS godoc
// @Summary Cloudos
// @Description get CloudOS
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.KeyValue
// @Security   Bearer
// @Router /spider/cloudos [get]
// @Tags VM
func GetCloudOS(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "cloudos",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	cloudos := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": cloudos,
	})

}

// GetALLCredential godoc
// @Summary Credential
// @Description get ALLCredential
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Success 200 {object} model.Credential
// @Router /spider/credentials [get]
// @Tags VM
func GetALLCredential(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	credential := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": credential,
	})

}

// GetCredential godoc
// @Summary Credential
// @Description get Credential
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Credential
// @Security   Bearer
// @Router /spider/credentials/{credentialName} [get]
// @Param credentialName path string true "Name of the credentials"
// @Tags VM
func GetCredential(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "credential",
		Name:   c.Param("name"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	credential := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": credential,
	})
}

func GetALLCredentialCount(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)

	var P model.CredentialCount
	json.Unmarshal([]byte(getData), &P)
	log.Printf("[#Credential Count] is %s", P.CredentialNames)

	return c.JSON(http.StatusOK, echo.Map{
		"credentialCnt": len(P.CredentialNames),
	})
}

// CreateCredential godoc
// @Summary Credential
// @Description get Credential
// @Param CredentialBody body string true "Credential Info Body"
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Error
// @Security   Bearer
// @Router /spider/credentials [post]
// @Tags VM
func CreateCredential(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	var getCredential model.GetCredential
	err2 := json.Unmarshal([]byte(params.Body), &getCredential)
	if err2 != nil {
		log.Fatal(err2)
	}

	credentialName := getCredential.CredentialName
	providerName := getCredential.ProviderName

	_ = CheckDriver(c, getCredential)
	_ = CheckRegion(c, getCredential)
	_ = CheckConnectionConfig(c, getCredential)
	_ = CheckKeyPair(c, getCredential)

	// var credentialInfo model.CredentialInfo
	// credential Key Value 생성
	var KeyValues model.KeyValues

	switch strings.ToUpper(providerName) {
	case "AWS":
		KeyValue := model.KeyValue{
			Key:   "ClientId",
			Value: getCredential.ClientId,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "ClientSecret",
			Value: getCredential.ClientSecret,
		}
		KeyValues = append(KeyValues, KeyValue)
	case "OPENSTACK":
		KeyValue := model.KeyValue{
			Key:   "IdentityEndpoint",
			Value: getCredential.IdentityEndpoint,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "Username",
			Value: getCredential.Username,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "Password",
			Value: getCredential.Password,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "DomainName",
			Value: getCredential.DomainName,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "ProjectID",
			Value: getCredential.ProjectID,
		}
		KeyValues = append(KeyValues, KeyValue)
	case "GCP":
		KeyValue := model.KeyValue{
			Key:   "PrivateKey",
			Value: getCredential.ClientSecret,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "ProjectID",
			Value: getCredential.ProjectID,
		}
		KeyValues = append(KeyValues, KeyValue)
		KeyValue = model.KeyValue{
			Key:   "ClientEmail",
			Value: getCredential.ClientId,
		}
		KeyValues = append(KeyValues, KeyValue)
	}

	createCredentialInfo := model.CredentialInfo{
		CredentialName:   credentialName,
		ProviderName:     providerName,
		KeyValueInfoList: KeyValues,
	}

	payload, _ := json.Marshal(createCredentialInfo)

	params = model.PARAMS{
		Kind:   "credential",
		Method: "POST",
		Body:   string(payload),
	}

	getData, err := common.DataRequest_spider(params)
	if err != nil {
		log.Println("err : ", err)
	}

	check := CreateCredentialDB(getCredential)
	if check != true {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("CreateCredentialDB failed."))
	}

	credential := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": credential,
	})
}

// DeleteCredential godoc
// @Summary Credential
// @Description get Credential
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Success 200 {object} model.Error
// @Router /spider/credentials/{credentialName} [delete]
// @Param credentialName path string true "Name of the credentials"
// @Tags VM
func DeleteCredential(c echo.Context) (err error) {
	credentialName := c.Param("name")

	origName := strings.TrimSuffix(credentialName, "-credential")

	// connectionConfig 삭제
	params := model.PARAMS{
		Kind:   "connectionconfig",
		Name:   origName + "-config",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	_, err = common.DataRequest_spider(params)

	// region 삭제
	params = model.PARAMS{
		Kind:   "cloudregion",
		Name:   origName + "-region",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	_, err = common.DataRequest_spider(params)

	// driver 삭제
	params = model.PARAMS{
		Kind:   "clouddriver",
		Name:   origName + "-driver",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	_, err = common.DataRequest_spider(params)

	// credentials 삭제
	params = model.PARAMS{
		Kind:   "credential",
		Name:   credentialName,
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	if err != nil {
		log.Println("err : ", err)
	}

	check := DeleteCredentialDB(credentialName)
	if check != true {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("DeleteCredentialDB failed."))
	}

	credential := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": credential,
	})

}

func GetALLConnectionconfig(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "connectionconfig",
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)
	connectionconfig := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": connectionconfig,
	})
}

func GetConnectionconfig(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "connectionconfig",
		Name:   c.Param("configName"),
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)
	connectionconfig := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": connectionconfig,
	})
}

func CheckConnectionConfig(c echo.Context, getCredential model.GetCredential) string {
	// fmt.Println("[CheckConnectionConfig in]")

	CredentialName := getCredential.CredentialName
	ProviderName := getCredential.ProviderName

	connectionConfigName := CredentialName + "-config"
	regionName := CredentialName + "-region"
	driverName := CredentialName + "-driver"

	// vpc 확인
	if !DuplicatiCheck(c, "connectionconfig", CredentialName) {
		// vpc 생성

		// connectionConfig 생성
		createConnectionConfigInfo := model.ConnectionConfigInfo{
			ConfigName:     connectionConfigName,
			ProviderName:   ProviderName,
			DriverName:     driverName,
			CredentialName: CredentialName,
			RegionName:     regionName,
		}

		payload, _ := json.Marshal(createConnectionConfigInfo)

		params := model.PARAMS{
			Kind:   "connectionconfig",
			Method: "POST",
			Body:   string(payload),
		}

		_, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}
	}

	return connectionConfigName
}

func CreateConnectionconfig(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "connectionconfig",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	connectionconfig := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": connectionconfig,
	})
}

func DeleteConnectionconfig(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "connectionconfig",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	connectionconfig := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": connectionconfig,
	})
}

func GetALLClouddriver(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "clouddriver",
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)
	clouddriver := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": clouddriver,
	})
}

func GetClouddriver(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "clouddriver",
		Name:   c.Param("clouddriverName"),
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)
	clouddriver := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": clouddriver,
	})
}

func RegisterClouddriver(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "clouddriver",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	clouddriver := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": clouddriver,
	})
}

func UnregisterClouddriver(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "clouddriver",
		Name:   c.Param("clouddriverName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	clouddriver := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": clouddriver,
	})
}

func GetALLCloudregion(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "cloudregion",
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)
	cloudregion := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": cloudregion,
	})
}

func GetCloudregion(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "cloudregion",
		Name:   c.Param("cloudregionName"),
		Method: c.Request().Method,
	}

	getData, err := common.DataRequest_spider(params)
	cloudregion := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": cloudregion,
	})
}

func CheckRegion(c echo.Context, getCredential model.GetCredential) string {
	// fmt.Println("[CheckRegion in]")

	CredentialName := getCredential.CredentialName
	ProviderName := getCredential.ProviderName
	Region := getCredential.Region
	Zone := getCredential.Zone

	regionName := CredentialName + "-region"

	// vpc 확인
	if !DuplicatiCheck(c, "region", CredentialName) {
		// vpc 생성

		// Region Key Value 생성
		var KeyValues model.KeyValues
		var KeyValue model.KeyValue

		switch strings.ToUpper(ProviderName) {
		case "AWS":
			KeyValue := model.KeyValue{
				Key:   "Region",
				Value: Region,
			}
			KeyValues = append(KeyValues, KeyValue)
			KeyValue = model.KeyValue{
				Key:   "Zone",
				Value: Zone,
			}
			KeyValues = append(KeyValues, KeyValue)
		case "OPENSTACK":
			if ProviderName != "" {
				KeyValue = model.KeyValue{
					Key:   "Region",
					Value: "RegionOne",
				}
				KeyValues = append(KeyValues, KeyValue)
			} else {
				KeyValue = model.KeyValue{
					Key:   "Region",
					Value: Region,
				}
				KeyValues = append(KeyValues, KeyValue)
			}
		case "GCP":
			KeyValue := model.KeyValue{
				Key:   "Region",
				Value: Region,
			}
			KeyValues = append(KeyValues, KeyValue)
			KeyValue = model.KeyValue{
				Key:   "Zone",
				Value: Zone,
			}
			KeyValues = append(KeyValues, KeyValue)
		}

		// fmt.Println("KeyValues is : ", KeyValues)

		createRegionInfo := model.RegionInfo{
			RegionName:       regionName,
			ProviderName:     ProviderName,
			KeyValueInfoList: KeyValues,
		}

		payload, _ := json.Marshal(createRegionInfo)

		params := model.PARAMS{
			Kind:   "cloudregion",
			Method: "POST",
			Body:   string(payload),
		}

		_, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}
	}

	return regionName
}

func RegisterCloudregion(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "cloudregion",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	cloudregion := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": cloudregion,
	})
}

func UnregisterCloudregion(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "cloudregion",
		Name:   c.Param("cloudregionName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	cloudregion := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": cloudregion,
	})
}

func VmControl(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "controlvm",
		Name:   c.Param("vmName"),
		Action: c.QueryParam("action"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vm := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})
}

func VmTerminate(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "controlvm",
		Name:   c.Param("vmName"),
		Action: c.QueryParam("action"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vm := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})
}

func GetALLVm(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:   "vm",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vm := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})
}

func GetALLVmCount(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmstatus",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)

	var P model.VMStatusCount
	json.Unmarshal([]byte(getData), &P)

	var vmCnt int = 0

	for i := 0; i < len(P.Vmstatus); i++ {
		vmCnt++
	}

	return c.JSON(http.StatusOK, echo.Map{
		"VMCnt": vmCnt,
	})

}

func GetVm(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vm",
		Name:   c.Param("vmName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vm := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})
}

func GetVmList(c echo.Context) (err error) {

	var CredentialNames []CredentialName
	params0 := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData0, _ := common.DataRequest_spider(params0)
	cds := common.FindingArray(common.Finding(getData0, "credential"))
	for e, _ := range cds {
		value := common.FindDataStr(cds[e].String(), "CredentialName", "")
		value2 := common.FindDataStr(cds[e].String(), "ProviderName", "")
		cd := CredentialName{
			CredentialName: value + "-config",
			ProviderName:   value2,
		}
		CredentialNames = append(CredentialNames, cd)
	}

	// fmt.Println("p#2] value : ", CredentialNames)

	vmParams := getConnectionVmList(CredentialNames)
	if len(vmParams) == 0 {
		return c.JSON(http.StatusOK, echo.Map{
			"count": len(vmParams),
			"data":  "VM Not Found",
		})
	}

	var VMStructs model.VMStructs
	for e, _ := range vmParams {

		switch strings.ToUpper(vmParams[e].Provider) {
		case "AWS":
			VMStruct := getVmStructs(vmParams[e], vmParams[e].Provider)
			VMStructs = append(VMStructs, VMStruct)

		case "OPENSTACK":
			VMStruct := getVmStructs(vmParams[e], vmParams[e].Provider)
			VMStructs = append(VMStructs, VMStruct)
		case "GCP":
			VMStruct := getVmStructs(vmParams[e], vmParams[e].Provider)
			VMStructs = append(VMStructs, VMStruct)
		}
	}

	// fmt.Println("[#8] VMStructs is ", VMStructs)
	// fmt.Println("[#8] VMStructs length is ", len(VMStructs))

	return c.JSON(http.StatusOK, echo.Map{
		"data":  VMStructs,
		"count": len(vmParams),
	})
}

func getVmStructs(vmParam vmParam, provider string) model.VMStruct {

	var VMStruct model.VMStruct

	ConnectionNameOnly := model.ConnectionNameOnly{
		ConnectionName: vmParam.Connection,
	}

	payload, _ := json.Marshal(ConnectionNameOnly)

	vmName := strings.TrimSuffix(common.InterfaceToString(vmParam.NameId), "}")
	vmName = strings.TrimLeft(vmName, "{")
	// fmt.Println("[#3]", vmName)

	params := model.PARAMS{
		Kind:   "vm",
		Name:   vmName,
		Method: "GET",
		Body:   string(payload),
	}
	getData, _ := common.DataRequest_spider(params)
	// fmt.Println("[#5] getData is ", getData)
	err := json.Unmarshal([]byte(getData), &VMStruct)
	if err != nil {
	}
	// fmt.Println("[#6] VMStruct is ", VMStruct)
	VMStruct.VmStatus = vmParam.Status
	VMStruct.ProviderName = provider

	return VMStruct
}

func getConnectionVmList(CredentialNames []CredentialName) []vmParam {

	var vmParams []vmParam
	var payload []byte
	for i, _ := range CredentialNames {
		ConnectionName := strings.TrimSuffix(common.InterfaceToString(CredentialNames[i].CredentialName), "}")

		ConnectionNameOnly := model.ConnectionNameOnly{
			ConnectionName: ConnectionName,
		}

		payload, _ = json.Marshal(ConnectionNameOnly)

		// cb-spider 에서 vmstatus 목록 가져와서, SystemId 추려내기 위함
		params := model.PARAMS{
			Kind:   "vmstatus",
			Method: "GET",
			Body:   string(payload),
		}
		getData, _ := common.DataRequest_spider(params)

		vms := common.FindingArray(common.Finding(getData, "vmstatus"))
		for j, _ := range vms {
			vmNameId := common.FindDataStr(vms[j].String(), "IId", "NameId")
			Status := common.FindDataStr(vms[j].String(), "VmStatus", "")
			// fmt.Println("p#2] vmNameId : ", vmNameId)
			vm := vmParam{
				NameId:     vmNameId,
				Status:     Status,
				Provider:   CredentialNames[i].ProviderName,
				Credential: CredentialNames[i].CredentialName,
				Connection: ConnectionName,
			}
			vmParams = append(vmParams, vm)
		}

		// fmt.Println("vmParams : ", vmParams)
	}

	return vmParams
}

func CreateVm(c echo.Context) (err error) {
	vmName := c.QueryParam("name")
	connectionName := c.QueryParam("config")
	imageName := c.QueryParam("image")
	flavorName := c.QueryParam("flavor")
	diskSize := c.QueryParam("disk")
	providerName := c.QueryParam("provider")
	// uniqName := "Ct2W9bAZ3kvcLJ54RzBR"

	vpcName, subnetName := CheckVPC(c, connectionName)
	securityGroupName := CheckSecurityGroup(c, connectionName)
	keyPairName := CheckKeyPairVM(c, connectionName)

	var securityGroupNameList []interface{}
	securityGroupNameList = append(securityGroupNameList, securityGroupName)

	var vmInfo model.CreateVMInfo
	switch strings.ToUpper(providerName) {
	case "AWS":
		vmInfo = model.CreateVMInfo{
			ConnectionName: connectionName,
			ReqInfo: model.VmReqInfo{
				Name:               vmName,
				ImageName:          imageName,
				VPCName:            vpcName,
				SubnetName:         subnetName,
				SecurityGroupNames: securityGroupNameList,
				VMSpecName:         flavorName,
				KeyPairName:        keyPairName,
				RootDiskSize:       diskSize,
			},
		}
	case "OPENSTACK":
		vmInfo = model.CreateVMInfo{
			ConnectionName: connectionName,
			ReqInfo: model.VmReqInfo{
				Name:               vmName,
				ImageName:          imageName,
				VPCName:            vpcName,
				SubnetName:         subnetName,
				SecurityGroupNames: securityGroupNameList,
				VMSpecName:         flavorName,
				KeyPairName:        keyPairName,
				RootDiskSize:       diskSize,
			},
		}
	case "GCP":
		vmInfo = model.CreateVMInfo{
			ConnectionName: connectionName,
			ReqInfo: model.VmReqInfo{
				Name:               vmName,
				ImageType:          "PublicImage",
				ImageName:          "https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/" + imageName,
				VPCName:            vpcName,
				SubnetName:         subnetName,
				SecurityGroupNames: securityGroupNameList,
				VMSpecName:         flavorName,
				KeyPairName:        keyPairName,
				RootDiskSize:       diskSize,
			},
		}
	}

	payload, _ := json.Marshal(vmInfo)

	params := model.PARAMS{
		Kind:   "vm",
		Method: "POST",
		Body:   string(payload),
	}

	getData, _ := common.DataRequest_spider(params)

	vm := common.StringToInterface(getData)
	return c.JSON(http.StatusCreated, echo.Map{
		"data": vm,
	})
}

func DeleteVm(c echo.Context) (err error) {
	params := model.PARAMS{
		Body: common.ResponseBody_spider(c.Request().Body),
	}
	var ConnectionNameOnly model.ConnectionNameOnly
	err0 := json.Unmarshal([]byte(params.Body), &ConnectionNameOnly)
	if err0 != nil {
	}

	// origName := strings.TrimSuffix(ConnectionNameOnly.ConnectionName, "-config")
	// connectionName := ConnectionNameOnly.ConnectionName
	payload, _ := json.Marshal(ConnectionNameOnly)

	// fmt.Println("connectionName is : ", connectionName)

	// // Vpc 삭제
	// params = model.PARAMS{
	// 	Kind:   "vpc",
	// 	Name:   connectionName + "-vpc",
	// 	Method: c.Request().Method,
	// 	Body:   string(payload),
	// }

	// _, err = common.DataRequest_spider(params)

	// // SecurityGroup 삭제
	// params = model.PARAMS{
	// 	Kind:   "securitygroup",
	// 	Name:   connectionName + "-sg",
	// 	Method: c.Request().Method,
	// 	Body:   string(payload),
	// }

	// _, err = common.DataRequest_spider(params)

	// // key 삭제
	// params = model.PARAMS{
	// 	Kind:   "keypair",
	// 	Name:   connectionName + "-key",
	// 	Method: c.Request().Method,
	// 	Body:   string(payload),
	// }

	// _, err = common.DataRequest_spider(params)

	// vm 삭제
	params = model.PARAMS{
		Kind:   "vm",
		Name:   c.Param("vmName"),
		Method: c.Request().Method,
		Body:   string(payload),
	}

	getData, err := common.DataRequest_spider(params)
	vm := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})

}

func GetALLVMStatus(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmstatus",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmstatus := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmstatus,
	})
}

func GetALLVMStatusList(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmstatus",
		Method: "GET",
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmstatus := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmstatus,
	})
}

func GetALLVMStatusCount(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmstatus",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)

	var P model.VMStatusCount
	json.Unmarshal([]byte(getData), &P)

	var running int = 0
	var suspended int = 0
	var failed int = 0

	for i := 0; i < len(P.Vmstatus); i++ {
		str := fmt.Sprintf("%v", P.Vmstatus[i])
		if str == "{Running}" {
			running++
		}
		if str == "{Suspended}" {
			suspended++
		}
		if str == "{Failed}" {
			failed++
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"Running": running,
		"Stop":    suspended,
		"Paused":  failed,
	})
}

func GetVMStatus(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmstatus",
		Name:   c.Param("vmstatusName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmstatus := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmstatus,
	})
}

func GetAllVmFlavor(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmspec",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)

	type Flavor struct {
		Name   string `json:"Name"`
		Memory string `json:"Memory"`
		VCpu   string `json:"VCpu"`
	}

	var Flavors []Flavor
	flavors := common.FindingArray(common.Finding(getData, "vmspec"))
	for e, _ := range flavors {
		flavorName := common.FindData(flavors[e].String(), "Name", "")
		flavorMemory := common.FindData(flavors[e].String(), "Mem", "")
		flavorVCpu := common.FindData(flavors[e].String(), "VCpu", "Count")
		flavorInfo := Flavor{
			Name:   common.InterfaceToString(flavorName),
			Memory: common.InterfaceToString(flavorMemory),
			VCpu:   common.InterfaceToString(flavorVCpu),
		}
		Flavors = append(Flavors, flavorInfo)
	}

	// fmt.Println("Flavors is : ", Flavors)

	// vmspec := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": Flavors,
	})
}

func GetALLVMSpec(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmspec",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmspec := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmspec,
	})
}

func GetVMSpec(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmspec",
		Name:   c.Param("vmspecName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmspec := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmspec,
	})
}

func GetALLVMOrgSpec(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmorgspec",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmorgspec := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmorgspec,
	})
}

func GetVMOrgSpec(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmorgspec",
		Name:   c.Param("vmspecName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmorgspec := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmorgspec,
	})
}

func GetALLVMImage(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmimage",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)

	var imageNameIds []NameId
	images := common.FindingArray(common.Finding(getData, "image"))
	for e, _ := range images {
		imageNameId := common.FindData(images[e].String(), "IId", "NameId")
		image := NameId{
			NameId: common.InterfaceToString(imageNameId),
		}
		imageNameIds = append(imageNameIds, image)
	}

	// fmt.Println("imageNameIds is : ", imageNameIds)
	// vmimage := common.StringToInterface(getData)
	if len(imageNameIds) != 0 {
		return c.JSON(http.StatusOK, echo.Map{
			"data": imageNameIds,
		})
	} else {
		return c.JSON(http.StatusOK, echo.Map{
			"data": StringToInterface(getData),
		})
	}
}

func GetVMImage(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmimage",
		Name:   c.Param("vmImageNameId"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmimage := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vmimage,
	})
}

func GetALLVPC(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vpc",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)

	fmt.Println("getData ", getData)

	vpc := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vpc,
	})
}

func GetVPC(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vpc",
		Name:   c.Param("vpcName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vpc := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vpc,
	})
}

func CheckVPC(c echo.Context, connectionName string) (string, string) {
	vpcName := connectionName + "-vpc"
	subnetName := connectionName + "-subnet"

	// vpc 확인
	if !DuplicatiCheck(c, "vpc", connectionName) {
		// vpc 생성

		var SubnetInfoList model.SubnetInfoLists
		subnetInfo := model.SubnetInfoList{
			Name:      subnetName,
			IPv4_CIDR: "10.10.1.0/24",
		}

		SubnetInfoList = append(SubnetInfoList, subnetInfo)

		createVpcInfo := model.CreateVPC{
			ConnectionName: connectionName,
			ReqInfo: model.VpcReqInfo{
				Name:            vpcName,
				IPv4_CIDR:       "10.10.0.0/16",
				SubnetInfoLists: SubnetInfoList,
			},
		}

		payload, _ := json.Marshal(createVpcInfo)

		params := model.PARAMS{
			Kind:   "vpc",
			Method: "POST",
			Body:   string(payload),
		}

		_, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}
	}

	return vpcName, subnetName
}

func CreateVPC(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vpc",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vpc := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vpc,
	})
}

func DeleteVPC(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vpc",
		Name:   c.Param("vpcName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vpc := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vpc,
	})
}

func GetALLSecurityGroup(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "securitygroup",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	securitygroup := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": securitygroup,
	})
}

func GetSecurityGroup(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "securitygroup",
		Name:   c.Param("securitygroupName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	securitygroup := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": securitygroup,
	})
}

func CheckSecurityGroup(c echo.Context, connectionName string) string {
	SecurityGroupName := connectionName + "-sg"

	// SecurityGroup 확인
	if !DuplicatiCheck(c, "securitygroup", connectionName) {
		// SecurityGroup 생성
		var SecurityRules model.SecurityRules
		SecurityRule := model.SecurityRule{
			FromPort:   "1",
			ToPort:     "65535",
			IPProtocol: "tcp",
			Direction:  "inbound",
		}

		SecurityRules = append(SecurityRules, SecurityRule)

		createSecurityGroupInfo := model.CreateSecurityGroup{
			ConnectionName: connectionName,
			ReqInfo: model.SecurityGroupReqInfo{
				Name:          SecurityGroupName,
				VPCName:       connectionName + "-vpc",
				SecurityRules: SecurityRules,
			},
		}

		payload, _ := json.Marshal(createSecurityGroupInfo)

		params := model.PARAMS{
			Kind:   "securitygroup",
			Method: "POST",
			Body:   string(payload),
		}

		_, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}
	}

	return SecurityGroupName
}

func CreateSecurityGroup(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "securitygroup",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	securitygroup := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": securitygroup,
	})
}

func DeleteSecurityGroup(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "securitygroup",
		Name:   c.Param("securitygroupName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	securitygroup := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": securitygroup,
	})
}

func RegisterSecurityGroup(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "regsecuritygroup",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	regsecuritygroup := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": regsecuritygroup,
	})
}

func UnregisterSecurityGroup(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "regsecuritygroup",
		Name:   c.Param("securitygroupName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	regsecuritygroup := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": regsecuritygroup,
	})
}

func GetALLKeypair(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "keypair",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	keypair := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": keypair,
	})
}

func GetKeypair(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "keypair",
		Name:   c.Param("keypairName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	keypair := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": keypair,
	})
}

func UpdateKeypairDB(credentialName string, data string) {

	cds := common.FindDataStr(data, "PrivateKey", "")
	// fmt.Println("##%#%# cds : ", cds)

	cdb := Conn("credentials")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := credentialName

	var update primitive.M
	update = bson.M{"KeyPair": cds}
	// }

	result, err := cdb.UpdateOne(ctx, bson.M{"name": search_val}, bson.M{"$set": update})
	if err != nil {
		log.Println("failed to update.")
	}

	if result.MatchedCount == 1 {
		if err := cdb.FindOne(ctx, bson.M{"name": search_val}).Decode(&cdb); err != nil {
			log.Println("failed to match Credentials.")
		}
	}
}


func CheckKeyPair(c echo.Context, getCredential model.GetCredential) string {
	CredentialName := getCredential.CredentialName
	connectionConfigName := CredentialName + "-config"


	keyPairName := connectionConfigName + "-key"

	// keypair 확인
	if !DuplicatiCheck(c, "keypair", keyPairName) {
		// keypair 생성
		createKeyPairInfo := model.CreateKeyPair{
			ConnectionName: connectionConfigName,
			ReqInfo: model.KeyPairReqInfo{
				Name: keyPairName,
			},
		}

		payload, _ := json.Marshal(createKeyPairInfo)

		params := model.PARAMS{
			Kind:   "keypair",
			Method: "POST",
			Body:   string(payload),
		}

		data, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}

		// fmt.Println("[%3] keypair return Value : ", data)

		// db 넣기
		UpdateKeypairDB(strings.TrimSuffix(connectionConfigName, "-config"), data)

	}

	return keyPairName
}

func CheckKeyPairVM(c echo.Context, connectionName string) string {
	keyPairName := connectionName + "-key"

	log.Println("################################ connectionName : ", connectionName);
	log.Println("################################ key : ", keyPairName);

	// keypair 확인
	if !DuplicatiCheck(c, "keypair", connectionName) {
		// keypair 생성
		createKeyPairInfo := model.CreateKeyPair{
			ConnectionName: connectionName,
			ReqInfo: model.KeyPairReqInfo{
				Name: keyPairName,
			},
		}

		payload, _ := json.Marshal(createKeyPairInfo)

		params := model.PARAMS{
			Kind:   "keypair",
			Method: "POST",
			Body:   string(payload),
		}

		data, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}

		// fmt.Println("[%3] keypair return Value : ", data)

		// db 넣기
		UpdateKeypairDB(strings.TrimSuffix(connectionName, "-config"), data)

	}

	return keyPairName
}

func CreateKeypair(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "keypair",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	keypair := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": keypair,
	})
}

func DeleteKeypair(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "keypair",
		Name:   c.Param("keypairName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	keypair := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": keypair,
	})
}

func RegisterKeypair(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "regkeypair",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	regkeypair := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": regkeypair,
	})
}

func UnregisterKeypair(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "regkeypair",
		Name:   c.Param("keypairName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	regkeypair := common.StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": regkeypair,
	})
}

func OpenstackVmList(opts gophercloud.AuthOptions, vmNameId []NameId) (model.OpenstackVmInfos, error) {
	// fmt.Println("[in VmList Function] Hello ?")

	type IID struct {
		NameId   string
		SystemId string
	}

	type VMInfo struct {
		IId IID
	}

	client, err := openstack.AuthenticatedClient(opts)
	if err != nil {
		log.Println("err is : ", err)
	}

	eo := gophercloud.EndpointOpts{
		Type:   "compute",
		Region: "RegionOne",
	}
	compute, err := openstack.NewComputeV2(client, eo)
	if err != nil {
		log.Println("err is : ", err)
	}

	var List model.OpenstackVmInfos
	for i := 0; i < len(vmNameId); i++ {
		ServerResult, _ := servers.Get(compute, common.InterfaceToString(vmNameId[i].NameId)).Extract()
		ImageResult, _ := images.Get(compute, common.InterfaceToString(ServerResult.Image["id"])).Extract()
		FlavorResult, _ := flavors.Get(compute, common.InterfaceToString(ServerResult.Flavor["id"])).Extract()

		vmInfo := model.OpenstackVmInfo{
			Id:             ServerResult.ID,
			Name:           ServerResult.Name,
			Status:         ServerResult.Status,
			Image:          ImageResult,
			Flavor:         FlavorResult,
			Addresses:      ServerResult.Addresses,
			Key:            ServerResult.KeyName,
			SecurityGroups: ServerResult.SecurityGroups,
			Created:        ServerResult.Created,
		}

		List = append(List, vmInfo)
	}

	return List, nil
}

func DuplicatiCheck(c echo.Context, _kind string, connectionName string) bool {
	log.Println("[DuplicatiCheck]")

	_Connection := model.ConnectionNameOnly{
		ConnectionName: connectionName,
	}
	payload, _ := json.Marshal(_Connection)

	var NameIds []NameId
	Check := false
	// cb-spider 에서 _kind 목록 가져와서, SystemId 추려내기 위함
	params := model.PARAMS{
		Kind:   _kind,
		Method: "GET",
		Body:   string(payload),
	}

	getData, _ := common.DataRequest_spider(params)
	kind := common.FindingArray(common.Finding(getData, _kind))

	// fmt.Println("_kind is : ", _kind)
	// fmt.Println("kind is : ", kind)
	var containValue string

	switch _kind {
	case "securitygroup":
		containValue = "-sg"
	case "keypair":
		containValue = "-key"
	case "vpc":
		containValue = "-vpc"
	case "connectionconfig":
		containValue = "-config"
	case "region":
		containValue = "-region"
	case "driver":
		containValue = "-driver"
	}

	for e, _ := range kind {
		kindNameId := common.FindData(kind[e].String(), "IId", "NameId")
		// fmt.Println("kindNameId is : ", kindNameId)
		// fmt.Println("kindNameId contains is : ", connectionName+containValue)
		if strings.Contains(common.InterfaceToString(kindNameId), connectionName+containValue) {
			Check = true
		}
		value := NameId{
			NameId: common.InterfaceToString(kindNameId),
		}
		NameIds = append(NameIds, value)
	}

	return Check
}

func CheckDriver(c echo.Context, getCredential model.GetCredential) string {

	CredentialName := getCredential.CredentialName
	ProviderName := getCredential.ProviderName

	driverName := CredentialName + "-driver"
	DriverLibFileName := ""

	switch strings.ToUpper(ProviderName) {
	case "AWS":
		DriverLibFileName = "aws-driver-v1.0.so"
	case "OPENSTACK":
		DriverLibFileName = "openstack-driver-v1.0.so"
	case "GCP":
		DriverLibFileName = "gcp-driver-v1.0.so"
	}

	// vpc 확인
	if !DuplicatiCheck(c, "driver", CredentialName) {
		// vpc 생성

		// connectionConfig 생성
		createDriverInfo := model.DriverInfo{
			DriverName:        driverName,
			ProviderName:      ProviderName,
			DriverLibFileName: DriverLibFileName,
		}

		payload, _ := json.Marshal(createDriverInfo)

		params := model.PARAMS{
			Kind:   "clouddriver",
			Method: "POST",
			Body:   string(payload),
		}

		_, err := common.DataRequest_spider(params)
		if err != nil {
			log.Println("err : ", err)
		}
	}

	return driverName
}

func GetCredentialDB(name string) *mongo.Collection {
	db := db.DbManager()
	cdb := db.Collection(name)

	return cdb
}

func CreateCredentialDB(getCredential model.GetCredential) bool {
	cdb := GetCredentialDB("credentials")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	models := model.Credential{
		CredentialName:   getCredential.CredentialName,
		ProviderName:     getCredential.ProviderName,
		IdentityEndpoint: getCredential.IdentityEndpoint,
		Username:         getCredential.Username,
		Password:         getCredential.Password,
		DomainName:       getCredential.DomainName,
		ProjectID:        getCredential.ProjectID,
		ClientId:         getCredential.ClientId,
		ClientSecret:     getCredential.ClientSecret,
		Region:           getCredential.Region,
		Zone:             getCredential.Zone,
		Created_at:       time.Now(),
	}
	_, err2 := cdb.InsertOne(ctx, models)
	if err2 != nil {
		return false
	}

	return true
}

// GetAllCredential godoc
// @Summary Show List credential
// @Description get credential List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Credential
// @Security Bearer
// @Router /credentials [get]
// @Tags Credential
func ListCredentialDB(c echo.Context) (err error) {
	var showsCredential []bson.M

	cdb := GetCredentialDB("credentials")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	findOptions := options.Find()

	cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}
	if err = cur.All(ctx, &showsCredential); err != nil {
		panic(err)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.TODO())
	return c.JSON(http.StatusOK, echo.Map{
		"status": http.StatusOK,
		"data":   showsCredential,
	})
}

// GetAllCredential godoc
// @Summary Show List credential
// @Description get credential List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Credential
// @Security Bearer
// @Router /credentials [get]
// @Tags Credential
func TypeCredentialDB(c echo.Context) (err error) {
	var showsCredential []bson.M
	_type := c.Param("type")

	cdb := GetCredentialDB("credentials")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	findOptions := options.Find()

	cur, err := cdb.Find(context.TODO(), bson.D{{"type", strings.ToUpper(_type)}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}
	if err = cur.All(ctx, &showsCredential); err != nil {
		panic(err)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.TODO())
	return c.JSON(http.StatusOK, echo.Map{
		"status": http.StatusOK,
		"data":   showsCredential,
	})
}

func FindCredentialDB(c echo.Context) (err error) {
	var credential model.Credential
	cdb := GetCredentialDB("credentials")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	search_val := c.Param("name")

	if err := cdb.FindOne(ctx, bson.M{"name": search_val}).Decode(&credential); err != nil {
		// fmt.Printcommon.ErrorMsg(c, http.StatusNotFound, errors.New("Credential not found."))
		return errors.New("Credential not found.")
	}

	return c.JSON(http.StatusOK, &credential)
}

func DeleteCredentialDB(credentialName string) bool {
	cdb := GetCredentialDB("credentials")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	result, err := cdb.DeleteOne(ctx, bson.M{"name": credentialName})
	if err != nil {
		return false
	}
	if result.DeletedCount == 0 {
		return false
	} else {
		return true
	}
}

func GetSpecList(c echo.Context) (err error) {
	Provider := c.QueryParam("provider")
	Type := c.QueryParam("type")
	cdb := GetClusterDB("vm")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := Provider
	search_val2 := Type
	cursor, err := cdb.Find(context.TODO(), bson.D{{Key: "provider", Value: search_val}, {Key: "Type", Value: search_val2}})
	if err != nil {
		log.Fatal(err)
	}
	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		log.Fatal(err)
	}
	return c.JSON(http.StatusOK, echo.Map{"data": results})
}
