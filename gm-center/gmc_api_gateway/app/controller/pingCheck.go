package controller

import (
	"gmc_api_gateway/app/common"

	"github.com/jasonlvhit/gocron"
)

func ClusterStatusCheck() {
	clusters := ListDB("cluster")
	for _, cluster := range clusters {
		val := node_running(common.InterfaceToString(cluster["clusterName"]))
		// fmt.Println(cluster["clusterName"], val)
		if val == 0 {
			// fmt.Println(cluster["clusterName"], val)
			UpdateClusterDB(common.InterfaceToString(cluster["clusterName"]), "false")
		} else {
			UpdateClusterDB(common.InterfaceToString(cluster["clusterName"]), "success")
		}
	}
	// fmt.Println("task : ", time.Now())
	// pinger, err := ping.NewPinger("223.62.156.241")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// pinger.Count = 3
	// pinger.Timeout = 1
	// err = pinger.Run() // Blocks until finished.
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// stats := pinger.Statistics()
	// fmt.Println("stats : ", stats)
}

func Cluster_Status_Cron() {
	// s := gocron.NewScheduler()
	gocron.Every(5).Minute().Do(ClusterStatusCheck)
	// gocron.Every(5).Seconds().Do(Task)
	// s.Every(5).Minute().Do(Task)
	<-gocron.Start()
}
