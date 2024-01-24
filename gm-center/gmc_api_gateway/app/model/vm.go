package model

import (
	"time"

	"github.com/gophercloud/gophercloud/openstack/compute/v2/flavors"
	"github.com/gophercloud/gophercloud/openstack/compute/v2/images"
)

type CredentialCount struct {
	CredentialNames []CredentialNameCount `json:"credential"`
}

type CredentialNameCount struct {
	CredentialName string `json:"CredentialName" `
}

type VMCount struct {
	VMCount []VMList `json:"vm"`
}

type VMList struct {
	VMList string `json:"IId" `
}

type VMStatusCount struct {
	Vmstatus []VMStatus `json:"vmstatus"`
}

type VMStatus struct {
	VMStatus string `json:"Vmstatus" `
}

type VmInfo struct {
	Id             string                   `json:"id"`
	Name           string                   `json:"name"`
	Status         string                   `json:"status"`
	ImageName      *images.Image            `json:"image"`
	Flavor         *flavors.Flavor          `json:"flavor"`
	Addresses      map[string]interface{}   `json:"addresses"`
	Key            string                   `json:"keypair"`
	SecurityGroups []map[string]interface{} `json:"securitygroups"`
	Created        time.Time                `json:"created"`
}

type OpenstackVmInfo struct {
	Id             string                   `json:"id"`
	Name           string                   `json:"name"`
	Status         string                   `json:"status"`
	Image          *images.Image            `json:"image"`
	Flavor         *flavors.Flavor          `json:"flavor"`
	Addresses      map[string]interface{}   `json:"addresses"`
	Key            string                   `json:"keypair"`
	SecurityGroups []map[string]interface{} `json:"securitygroups"`
	Created        time.Time                `json:"created"`
}

type OpenstackVmInfos []OpenstackVmInfo

type SubnetInfoList struct {
	Name      string `json:"Name"`
	IPv4_CIDR string `json:"IPv4_CIDR"`
}

type SubnetInfoLists []SubnetInfoList

type SecurityRule struct {
	FromPort   string `json:"FromPort"`
	ToPort     string `json:"ToPort"`
	IPProtocol string `json:"IPProtocol"`
	Direction  string `json:"Direction"`
}

type SecurityRules []SecurityRule

type VpcReqInfo struct {
	Name            string `json:"Name"`
	IPv4_CIDR       string `json:"IPv4_CIDR"`
	SubnetInfoLists `json:"SubnetInfoList"`
}

type SecurityGroupReqInfo struct {
	Name          string        `json:"Name"`
	VPCName       string        `json:"VPCName"`
	SecurityRules SecurityRules `json:"SecurityRules"`
}

type KeyPairReqInfo struct {
	Name string `json:"name"`
}

type VmReqInfo struct {
	Name               string        `json:"Name"`
	ImageType          string        `json:"imageType"`
	ImageName          string        `json:"ImageName"`
	VPCName            string        `json:"VPCName"`
	SubnetName         string        `json:"SubnetName"`
	SecurityGroupNames []interface{} `json:"SecurityGroupNames"`
	VMSpecName         string        `json:"VMSpecName"`
	KeyPairName        string        `json:"KeyPairName"`
	RootDiskSize       string        `json:"RootDiskSize"`
}

type ConnectionNameOnly struct {
	ConnectionName string `json:"ConnectionName"`
}

type CreateVPC struct {
	ConnectionName string `json:"ConnectionName"`
	ReqInfo        VpcReqInfo
}

type CreateSecurityGroup struct {
	ConnectionName string `json:"ConnectionName"`
	ReqInfo        SecurityGroupReqInfo
}

type CreateKeyPair struct {
	ConnectionName string `json:"ConnectionName"`
	ReqInfo        KeyPairReqInfo
}

type CreateVMInfo struct {
	ConnectionName string `json:"ConnectionName"`
	ReqInfo        VmReqInfo
}
type KeyValue struct {
	Key   string `json:"Key"`
	Value string `json:"Value"`
}

type KeyValues []KeyValue

type GetCredential struct {
	CredentialName   string `json:"CredentialName"`
	ProviderName     string `json:"ProviderName"`
	IdentityEndpoint string `json:"IdentityEndpoint"`
	Username         string `json:"Username"`
	Password         string `json:"Password"`
	DomainName       string `json:"DomainName"`
	ProjectID        string `json:"ProjectID"`
	ClientId         string `json:"ClientId"`
	ClientSecret     string `json:"ClientSecret"`
	Region           string `json:"Region"`
	Zone             string `json:"Zone"`
}

type CredentialInfo struct {
	CredentialName   string    `json:"CredentialName"`
	ProviderName     string    `json:"ProviderName"`
	KeyValueInfoList KeyValues `json:"KeyValueInfoList"`
}

type RegionInfo struct {
	RegionName       string    `json:"RegionName"`
	ProviderName     string    `json:"ProviderName"`
	KeyValueInfoList KeyValues `json:"KeyValueInfoList"`
}

type ConnectionConfigInfo struct {
	ConfigName     string `json:"ConfigName"`
	ProviderName   string `json:"ProviderName"`
	DriverName     string `json:"DriverName"`
	CredentialName string `json:"CredentialName"`
	RegionName     string `json:"RegionName"`
}

type DriverInfo struct {
	DriverName        string `json:"DriverName"`
	ProviderName      string `json:"ProviderName"`
	DriverLibFileName string `json:"DriverLibFileName"`
}

type IId struct {
	IId      string `json:"NameId"`
	SystemId string `json:"SystemId"`
}

type Region struct {
	Region string `json:"Region"`
	Zone   string `json:"Zone"`
}

type VMStruct struct {
	IId               IId    `json:"IId"`
	ProviderName      string `json:"ProviderName"`
	Region            Region `json:"Region"`
	VmStatus          string `json:"VmStatus"`
	ImageIId          IId    `json:"ImageIId"`
	VMSpecName        string `json:"VMSpecName"`
	VpcIID            IId    `json:"VpcIID"`
	SubnetIID         IId    `json:"SubnetIID"`
	SecurityGroupIIds IId    `json:"SecurityGroupIIds"`
	KeyPairIId        IId    `json:"KeyPairIId"`
	RootDiskType      string `json:"RootDiskType"`
	RootDiskSize      string `json:"RootDiskSize"`
	RootDeviceName    string `json:"RootDeviceName"`
	VMBootDisk        string `json:"VMBootDisk"`
	VMBlockDisk       string `json:"VMBlockDisk"`
	VMUserId          string `json:"VMUserId"`
	VMUserPasswd      string `json:"VMUserPasswd"`
	NetworkInterface  string `json:"NetworkInterface"`
	PublicIP          string `json:"PublicIP"`
	PublicDNS         string `json:"PublicDNS"`
	PrivateIP         string `json:"PrivateIP"`
	PrivateDNS        string `json:"PrivateDNS"`
	SSHAccessPoint    string `json:"SSHAccessPoint"`
	KeyValueList      string `json:"KeyValueList"`
}

type VMStructs []VMStruct

// type EVENT1 struct {
// 	Metadata struct {
// 		Name              string    `json:"name"`
// 		Namespace         string    `json:"namespace"`
// 		CreationTimestamp time.Time `json:"creationTimestamp"`
// 	} `json:"metadata"`
// 	Regarding struct {
// 		Kind string `json:"kind"`
// 		Name string `json:"name"`
// 	} `json:"regarding"`
// 	Reason string `json:"reason"`
// 	Type   string `json:"type"`
// 	Note   string `json:"note"`
// }
