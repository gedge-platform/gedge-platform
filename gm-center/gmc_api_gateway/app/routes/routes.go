package routes

import (
	"os"

	c "gmc_api_gateway/app/controller"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type jwtCustomClaims struct {
	Name string `json:"name"`
	Role string `json:"role"`
	jwt.StandardClaims
}

type DataValidator struct {
	validator *validator.Validate
}

func NewValidator() *DataValidator {
	return &DataValidator{
		validator: validator.New(),
	}
}

func (dv *DataValidator) Validate(i interface{}) error {
	return dv.validator.Struct(i)
}

func GEdgeRoute(e *echo.Echo) {
	e.Validator = NewValidator()

	e.POST("/gmcapi/v2/auth", c.LoginUser)
	e.PUT("/callback-scheduler", c.CallbackScheduler)
	r0 := e.Group("/gmcapi/v2/restricted")

	// decoded, err := base64.URLEncoding.DecodeString(os.Getenv("SIGNINGKEY"))
	// if err != nil {
	// 	fmt.Println("signingkey base64 decoded Error")
	// }

	config := middleware.JWTConfig{
		Claims:     &jwtCustomClaims{},
		SigningKey: []byte(os.Getenv("SIGNINGKEY")),
	}

	r0.Use(middleware.JWTWithConfig(config))
	r0.GET("/test", c.ListMember)

	// /gmcapi/v2
	r := e.Group("/gmcapi/v2", middleware.JWTWithConfig(config))

	r.POST("/members", c.CreateMember)
	r.GET("/members", c.ListMember)
	r.GET("/members/:memberId", c.FindMember)
	r.DELETE("/members/:memberId", c.DeleteMember)
	r.PUT("/members/:memberId", c.UpdateMember)

	r.POST("/clusters", c.CreateCluster)
	r.GET("/clusters", c.ListCluster)
	r.GET("/clusters/:name", c.FindCluster)
	r.DELETE("/clusters/:name", c.DeleteCluster)
	r.PUT("/clusters/:name", c.UpdateCluster)

	r.GET("/certifications/:name", c.FindCredentialDB)

	r.POST("/workspaces", c.CreateWorkspace)
	r.GET("/workspaces", c.ListWorkspace)
	r.GET("/workspaces/:name", c.FindWorkspace)
	r.DELETE("/workspaces/:name", c.DeleteWorkspace)
	r.PUT("/workspaces/:name", c.UpdateWorkspace)

	r.POST("/projects", c.CreateProject)
	r.GET("/userProjects", c.ListUserProject)
	r.GET("/systemProjects", c.ListSystemProject)
	r.GET("/userProjects/:name", c.GetUserProject)
	r.GET("/systemProjects/:name", c.GetSystemProject)
	r.DELETE("/projects/:name", c.DeleteProject)
	r.PUT("/projects/:name", c.UpdateProject)

	r.POST("/request", c.CreateRequest)
	r.GET("/request", c.ListRequest)
	r.GET("/request/:requestId", c.FindRequest)
	r.DELETE("/request/:requestId", c.DeleteRequest)
	r.PUT("/request/:requestId", c.UpdateRequest)

	r.GET("/view/:name", c.GetView)

	r.GET("/deployments", c.GetDeployments)
	r.POST("/deployments", c.CreateDeployment)
	r.GET("/deployments/:name", c.GetDeployment)
	// r.PUT("/deployments/:name", c.UpdateDeployment)
	r.DELETE("/deployments/:name", c.DeleteDeployment)

	r.GET("/pods", c.GetAllPods)
	r.POST("/pods", c.CreatePod)
	r.GET("/pods/:name", c.GetPods)
	// r.PUT("/pods/:name", c.UpdatePods)
	r.DELETE("/pods/:name", c.DeletePod)

	r.GET("/jobs", c.GetAllJobs)
	r.POST("/jobs", c.CreateJob)
	r.GET("/jobs/:name", c.GetJobs)
	// r.PUT("/jobs/:name", c.UpdateJob)
	r.DELETE("/jobs/:name", c.DeleteJob)

	r.GET("/cronjobs", c.GetCronAllJobs)
	r.POST("/cronjobs", c.CreateCronJob)
	r.GET("/cronjobs/:name", c.GetCronJobs)
	// r.PUT("/cronjobs/:name", c.UpdateCronJobs)
	r.DELETE("/cronjobs/:name", c.DeleteCronJob)

	r.GET("/services", c.GetServices)
	r.POST("/services", c.CreateService)
	r.GET("/services/:name", c.GetService)
	// r.PUT("/services/:name", c.UpdateService)
	r.DELETE("/services/:name", c.DeleteService)

	r.GET("/pvs", c.GetAllPVs)
	r.POST("/pvs", c.CreatePV)
	r.GET("/pvs/:name", c.GetPV)
	// // r.PUT("/services/:name", c.UpdateService)
	r.DELETE("/pvs/:name", c.DeletePV)

	r.GET("/pvcs", c.GetAllPVCs)
	r.POST("/pvcs", c.CreatePVC)
	r.GET("/pvcs/:name", c.GetPVC)
	// // r.PUT("/services/:name", c.UpdateService)
	r.DELETE("/pvcs/:name", c.DeletePVC)

	r.GET("/secrets", c.GetAllSecrets)
	r.POST("/secrets", c.CreateSecret)
	r.GET("/secrets/:name", c.GetSecret)
	// // r.PUT("/services/:name", c.UpdateService)
	r.DELETE("/secrets/:name", c.DeleteSecret)

	r.GET("/storageclasses/:name", c.GetStorageclass)
	r.GET("/storageclasses", c.GetStorageclasses)
	r.POST("/storageclasses", c.CreateStorageclasses)
	r.DELETE("/storageclasses/:name", c.DeleteStorageclasses)

	r.GET("/clusterroles/:name", c.GetClusterRole)
	r.GET("/clusterroles", c.GetClusterRoles)

	r.GET("/roles/:name", c.GetRole)
	r.GET("/roles", c.GetRoles)

	r.GET("/configmaps", c.GetAllConfigmaps)
	r.GET("/configmaps/:name", c.GetConfigmap)

	r.GET("/daemonsets", c.GetAllDaemonsets)
	r.GET("/daemonsets/:name", c.GetDaemonset)
	r.POST("/daemonsets", c.CreateDaemonset)
	r.DELETE("/daemonsets/:name", c.DeleteDaemonset)

	r.GET("/statefulsets", c.GetAllStatefulset)
	r.GET("/statefulsets/:name", c.GetStatefulset)
	r.POST("/statefulsets", c.CreateStatefulset)
	r.DELETE("/statefulsets/:name", c.DeleteStatefulset)

	r.GET("/serviceaccounts", c.GetAllServiceaccounts)
	r.GET("/serviceaccounts/:name", c.GetServiceaccount)

	r.GET("/clusterrolebindings", c.GetAllClusterrolebindings)
	r.GET("/clusterrolebindings/:name", c.GetClusterrolebinding)
	r.POST("/clusterrolebindings", c.CreateClusterRolebinding)
	r.DELETE("/clusterrolebindings/:name", c.DeleteClusterRolebinding)

	r.GET("/duplicateCheck/:name", c.DuplicateCheckDB)

	r.GET("/view/:name", c.GetView)
	r.GET("/metallb", c.GetAllMetallb)
	r.GET("/metallbDetail", c.GetMetallb)

	r.GET("/totalDashboard", c.TotalDashboard)
	r.GET("/cloudDashboard", c.CloudDashboard)
	r.GET("/serviceDashboard", c.SADashboard)
	r.GET("/resourceMonitoring", c.ResourceMonit)

	e.GET("/clusterInfo", c.GetClusterInfo)
	e.POST("/auth", c.LoginUser)
	// r.GET("/ceph/health", c.GetCephHealth)
	r.GET("/ceph/monitoring", c.CephMonit)
	r.GET("/ceph/monit", c.CephDashboard)
	r.GET("/cluster/addWorkNode", c.AddWorkerNode)

	r.POST("/gs-scheduler", c.PostScheduler)
	r.GET("/loki", c.GetLogs)
	r2 := e.Group("/kube/v1", middleware.BasicAuth(func(id, password string, echo echo.Context) (bool, error) {
		userChk, _ := c.AuthenticateUser(id, password)
		return userChk, nil
	}))

	r.GET("/gpu", c.GetGpu)
	// r2.Any("/:cluster_name", api.Kubernetes)
	// r2.Any("/:cluster_name/:namespace_name", api.Kubernetes)
	// r2.Any("/:cluster_name/:namespace_name/:kind_name", api.Kubernetes)
	// r2.Any("/:cluster_name/:namespace_name/:kind_name/*", api.Kubernetes)
	r2.GET("/monitoring/query", c.Query_monit)
	r2.GET("/metrics", echo.WrapHandler(promhttp.Handler()))
	r2.GET("/monitoring", echo.WrapHandler(promhttp.Handler()))
	r2.Any("/monitoring/:kind", c.Monit)
	// r2.Any("/monitoring/:kind/:name", api.Monit)
	r2.Any("/monitoring/realtime/:kind", c.RealMetrics)
	r2.Any("/monitoring/realtime", c.RealMetrics)

	r3 := e.Group("/gmcapi/v2/spider", middleware.JWTWithConfig(config))
	// r3 := e.Group("/gmcapi/v2/spider")
	r3.GET("/cloudos", c.GetCloudOS)

	r3.GET("/credentials", c.GetALLCredential)
	r3.GET("/credentials/:name", c.GetCredential)
	r3.POST("/credentials", c.CreateCredential)
	r3.DELETE("/credentials/:name", c.DeleteCredential)
	r3.GET("/credentialsCount", c.GetALLCredentialCount)

	r3.GET("/specList", c.GetSpecList)

	r3.GET("/connectionconfig", c.GetALLConnectionconfig)
	r3.GET("/connectionconfig/:configName", c.GetConnectionconfig)
	r3.POST("/connectionconfig", c.CreateConnectionconfig)
	r3.DELETE("/connectionconfig/:configName", c.GetConnectionconfig)

	r3.GET("/clouddriver", c.GetALLClouddriver)
	r3.GET("/clouddriver/:clouddriverName", c.GetClouddriver)
	r3.POST("/clouddriver", c.RegisterClouddriver)
	r3.DELETE("/clouddriver/:clouddriverName", c.UnregisterClouddriver)

	r3.GET("/cloudregion", c.GetALLCloudregion)
	r3.GET("/cloudregion/:cloudregionName", c.GetCloudregion)
	r3.POST("/cloudregion", c.RegisterCloudregion)
	r3.DELETE("/cloudregion/:cloudregionName", c.UnregisterCloudregion)

	r3.GET("/vm", c.GetALLVm)
	r3.GET("/vmList", c.GetVmList)
	r3.GET("/credentialList", c.ListCredentialDB)
	r3.GET("/credentialList/:type", c.TypeCredentialDB)
	r3.GET("/specList", c.GetSpecList)
	r3.POST("/vmStatus", c.GetALLVMStatusList)
	r3.GET("/vm/:vmName", c.GetVm)
	r3.POST("/vm", c.CreateVm)
	r3.DELETE("/vm/:vmName", c.DeleteVm)
	r3.GET("/vm/vmCount", c.GetALLVmCount)

	r3.GET("/vm/vmstatus", c.GetALLVMStatus)
	r3.GET("/vm/vmstatus/:vmstatusName", c.GetVMStatus)
	r3.GET("/vm/vmstatus/vmstatusCount", c.GetALLVMStatusCount)

	r3.GET("/vm/vmflavor", c.GetAllVmFlavor)
	r3.GET("/vm/vmspec", c.GetALLVMSpec)
	r3.GET("/vm/vmspec/:vmspecName", c.GetVMSpec)

	r3.GET("/vm/vmorgspec", c.GetALLVMOrgSpec)
	r3.GET("/vm/vmorgspec/:vmspecName", c.GetVMOrgSpec)

	r3.GET("/vm/vmimage", c.GetALLVMImage)
	r3.GET("/vm/vmimage/:vmImageNameId", c.GetVMImage)

	r3.GET("/vm/vpc", c.GetALLVPC)
	r3.GET("/vm/vpc/:vpcName", c.GetVPC)
	r3.POST("/vm/vpc", c.CreateVPC)
	r3.DELETE("/vm/vpc/:vpcName", c.DeleteVPC)

	r3.GET("/vm/securitygroup", c.GetALLSecurityGroup)
	r3.GET("/vm/securitygroup/:securitygroupName", c.GetSecurityGroup)
	r3.POST("/vm/securitygroup", c.CreateSecurityGroup)
	r3.DELETE("/vm/securitygroup/:securitygroupName", c.DeleteSecurityGroup)

	r3.POST("/vm/regsecuritygroup", c.CreateSecurityGroup)
	r3.DELETE("/vm/regsecuritygroup/:securitygroupName", c.DeleteSecurityGroup)

	r3.GET("/vm/keypair", c.GetALLKeypair)
	r3.GET("/vm/keypair/:keypairName", c.GetKeypair)
	r3.POST("/vm/keypair", c.CreateKeypair)
	r3.DELETE("/vm/keypair/:keypairName", c.DeleteKeypair)

	r3.POST("/vm/regkeypair", c.RegisterKeypair)
	r3.DELETE("/vm/regkeypair/:keypairName", c.UnregisterKeypair)

	r3.GET("/controlvm/:vmName", c.VmControl)
	r3.DELETE("/controlvm/:vmName", c.VmTerminate)
}
