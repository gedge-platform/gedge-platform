package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"net/http"

	"gmc_api_gateway/app/common"

	"gmc_api_gateway/app/model"

	"github.com/labstack/echo/v4"

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
}

// GetCloudOS godoc
// @Summary Cloudos
// @Description get CloudOS
// @ApiImplicitParam
// @Accept  json
// @Produce  json
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
	cloudos := StringToInterface(getData)

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
// @Router /spider/credentials [get]
// @Tags VM
func GetALLCredential(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	credential := StringToInterface(getData)

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
// @Security   Bearer
// @Router /spider/credentials/{credentialName} [get]
// @Param credentialName path string true "Name of the credentials"
// @Tags VM
func GetCredential(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "credential",
		Name:   c.Param("credentialName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	credential := StringToInterface(getData)

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
// @Security   Bearer
// @Router /spider/credentials [post]
// @Tags VM
func CreateCredential(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	var credentialInfo model.CredentialInfo
	err2 := json.Unmarshal([]byte(params.Body), &credentialInfo)
	if err2 != nil {
		log.Fatal(err2)
	}

	credentialName := credentialInfo.CredentialName
	providerName := credentialInfo.ProviderName

	_ = CheckDriver(c, credentialName, providerName)
	_ = CheckRegion(c, credentialName, providerName)
	_ = CheckConnectionConfig(c, credentialName, providerName)

	// var KeyValues model.KeyValues
	// KeyValue := model.KeyValue {
	// 	Key: "Region",
	// 	Value: "RegionOne",
	// }

	// KeyValues = append(KeyValues, KeyValue)

	createCredentialInfo := model.CredentialInfo{
		CredentialName:   credentialName,
		ProviderName:     providerName,
		KeyValueInfoList: credentialInfo.KeyValueInfoList,
	}

	payload, _ := json.Marshal(createCredentialInfo)

	params = model.PARAMS{
		Kind:   "credential",
		Method: "POST",
		Body:   string(payload),
	}

	getData, err := common.DataRequest_spider(params)
	if err != nil {
		fmt.Println("err : ", err)
	}
	credential := StringToInterface(getData)

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
// @Router /spider/credentials/{credentialName} [delete]
// @Param credentialName path string true "Name of the credentials"
// @Tags VM
func DeleteCredential(c echo.Context) (err error) {
	credentialName := c.Param("credentialName")

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
		Kind:   "region",
		Name:   origName + "-region",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	_, err = common.DataRequest_spider(params)

	// driver 삭제
	params = model.PARAMS{
		Kind:   "driver",
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
	credential := StringToInterface(getData)

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
	connectionconfig := StringToInterface(getData)

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
	connectionconfig := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": connectionconfig,
	})
}

func CheckConnectionConfig(c echo.Context, CredentialName string, ProviderName string) string {
	fmt.Println("[CheckConnectionConfig in]")

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
			fmt.Println("err : ", err)
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
	connectionconfig := StringToInterface(getData)

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
	connectionconfig := StringToInterface(getData)

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
	clouddriver := StringToInterface(getData)

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
	clouddriver := StringToInterface(getData)

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
	clouddriver := StringToInterface(getData)

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
	clouddriver := StringToInterface(getData)

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
	cloudregion := StringToInterface(getData)

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
	cloudregion := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": cloudregion,
	})
}

func CheckRegion(c echo.Context, CredentialName string, ProviderName string) string {
	fmt.Println("[CheckRegion in]")

	regionName := CredentialName + "-region"

	// vpc 확인
	if !DuplicatiCheck(c, "region", CredentialName) {
		// vpc 생성

		// Region Key Value 생성
		var KeyValues model.KeyValues
		KeyValue := model.KeyValue{
			Key:   "Region",
			Value: "RegionOne",
		}

		KeyValues = append(KeyValues, KeyValue)

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
			fmt.Println("err : ", err)
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
	cloudregion := StringToInterface(getData)

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
	cloudregion := StringToInterface(getData)

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
	vm := StringToInterface(getData)

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
	vm := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})
}

func GetALLVm(c echo.Context) (err error) {

	var SystemIds []SystemId
	// cb-spider 에서 vmstatus 목록 가져와서, SystemId 추려내기 위함
	params := model.PARAMS{
		Kind:   "vmstatus",
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	// vm := common.FindData(getData, "vmstatus", "IId")
	vms := common.FindingArray(common.Finding(getData, "vmstatus"))
	for e, _ := range vms {
		vmSystemId := common.FindData(vms[e].String(), "IId", "SystemId")
		vm := SystemId{
			SystemId: common.InterfaceToString(vmSystemId),
		}
		SystemIds = append(SystemIds, vm)
	}

	fmt.Println("vmSystemIds : ", SystemIds)

	if len(SystemIds) == 0 {
		return c.JSON(http.StatusOK, echo.Map{
			"count": len(SystemIds),
			"data":  "VM Not Found",
		})
	}

	// TODO: 임시
	OpenStackAuthOpts := gophercloud.AuthOptions{
		IdentityEndpoint: "http://192.168.160.220:5000",
		Username:         "consine2c",
		Password:         "consine2c",
		DomainName:       "Default",
	}
	// OpenStackAuthOpts := gophercloud.AuthOptions{
	// 	IdentityEndpoint: c.QueryParam("endpoint"),
	// 	Username:         c.QueryParam("username"),
	// 	Password:         c.QueryParam("password"),
	// 	DomainName:       "Default",
	// }

	getData2, _ := OpenstackVmList(OpenStackAuthOpts, SystemIds)

	fmt.Println("getData is : ", getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data":  getData2,
		"count": len(SystemIds),
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
	vm := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})

}

func CreateVm(c echo.Context) (err error) {
	vmName := c.QueryParam("name")
	connectionName := c.QueryParam("config")
	imageName := c.QueryParam("image")
	flavorName := c.QueryParam("flavor")
	// uniqName := "Ct2W9bAZ3kvcLJ54RzBR"

	vpcName, subnetName := CheckVPC(c, connectionName)
	securityGroupName := CheckSecurityGroup(c, connectionName)
	keyPairName := CheckKeyPair(c, connectionName)

	var securityGroupNameList []interface{}
	securityGroupNameList = append(securityGroupNameList, securityGroupName)

	vmInfo := model.CreateVMInfo{
		ConnectionName: connectionName,
		ReqInfo: model.VmReqInfo{
			Name:               vmName,
			ImageName:          imageName,
			VPCName:            vpcName,
			SubnetName:         subnetName,
			SecurityGroupNames: securityGroupNameList,
			VMSpecName:         flavorName,
			KeyPairName:        keyPairName,
		},
	}

	payload, _ := json.Marshal(vmInfo)

	params := model.PARAMS{
		Kind:   "vm",
		Method: c.Request().Method,
		Body:   string(payload),
	}

	getData, _ := common.DataRequest_spider(params)

	vm := StringToInterface(getData)
	return c.JSON(http.StatusOK, echo.Map{
		"data": vm,
	})
}

func DeleteVm(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vm",
		Name:   c.Param("vmName"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vm := StringToInterface(getData)

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
	vmstatus := StringToInterface(getData)

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
	vmstatus := StringToInterface(getData)

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

	fmt.Println("Flavors is : ", Flavors)

	// vmspec := StringToInterface(getData)

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
	vmspec := StringToInterface(getData)

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
	vmspec := StringToInterface(getData)

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
	vmorgspec := StringToInterface(getData)

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
	vmorgspec := StringToInterface(getData)

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

	fmt.Println("imageNameIds is : ", imageNameIds)
	// vmimage := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": imageNameIds,
	})
}

func GetVMImage(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:   "vmimage",
		Name:   c.Param("vmImageNameId"),
		Method: c.Request().Method,
		Body:   common.ResponseBody_spider(c.Request().Body),
	}

	getData, err := common.DataRequest_spider(params)
	vmimage := StringToInterface(getData)

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
	vpc := StringToInterface(getData)

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
	vpc := StringToInterface(getData)

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
			fmt.Println("err : ", err)
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
	vpc := StringToInterface(getData)

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
	vpc := StringToInterface(getData)

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
	securitygroup := StringToInterface(getData)

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
	securitygroup := StringToInterface(getData)

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
			fmt.Println("err : ", err)
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
	securitygroup := StringToInterface(getData)

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
	securitygroup := StringToInterface(getData)

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
	regsecuritygroup := StringToInterface(getData)

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
	regsecuritygroup := StringToInterface(getData)

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
	keypair := StringToInterface(getData)

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
	keypair := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": keypair,
	})
}

func CheckKeyPair(c echo.Context, connectionName string) string {
	keyPairName := connectionName + "-key"

	// vpc 확인
	if !DuplicatiCheck(c, "keypair", connectionName) {
		// vpc 생성
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

		_, err := common.DataRequest_spider(params)
		if err != nil {
			fmt.Println("err : ", err)
		}
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
	keypair := StringToInterface(getData)

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
	keypair := StringToInterface(getData)

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
	regkeypair := StringToInterface(getData)

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
	regkeypair := StringToInterface(getData)

	return c.JSON(http.StatusOK, echo.Map{
		"data": regkeypair,
	})
}

func OpenstackVmList(opts gophercloud.AuthOptions, vmSystemId []SystemId) (model.OpenstackVmInfos, error) {
	fmt.Println("[in VmList Function] Hello ?")

	type IID struct {
		NameId   string
		SystemId string
	}

	type VMInfo struct {
		IId IID
	}

	client, err := openstack.AuthenticatedClient(opts)
	if err != nil {
		panic(err)
	}

	eo := gophercloud.EndpointOpts{
		Type:   "compute",
		Region: "RegionOne",
	}
	compute, err := openstack.NewComputeV2(client, eo)
	if err != nil {
		panic(err)
	}

	var List model.OpenstackVmInfos
	for i := 0; i < len(vmSystemId); i++ {
		ServerResult, _ := servers.Get(compute, common.InterfaceToString(vmSystemId[i].SystemId)).Extract()
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
	fmt.Println("[DuplicatiCheck]")

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

	fmt.Println("_kind is : ", _kind)
	fmt.Println("kind is : ", kind)
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
		fmt.Println("kindNameId is : ", kindNameId)
		fmt.Println("kindNameId contains is : ", connectionName+containValue)
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

func CheckDriver(c echo.Context, CredentialName string, ProviderName string) string {
	fmt.Println("[CheckDriver in]")

	driverName := CredentialName + "-driver"
	DriverLibFileName := ""

	switch ProviderName {
	case "AWS":
		DriverLibFileName = "aws-driver-v1.0.so"
	case "OPENSTACK":
		DriverLibFileName = "openstack-driver-v1.0.so"
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
			fmt.Println("err : ", err)
		}
	}

	return driverName
}
