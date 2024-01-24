package controller

import (
	//"encoding/json"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"os"

	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"backend/model"
	"backend/util"
)

type Cluster struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	IP             string `json:"ip"`
	DashboardPort  int    `json:"dashboardPort"`
	APIPort        int    `json:"apiPort"`
	RPCPort        int    `json:"rpcPort"`
	State          bool   `json:"state"`
	Date           string `json:"date"`
	ClusterGroupId int    `json:"ClusterGroupId"`
	Local          bool   `json:"local"`
}

func GetSingleCluster(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	db := model.DBConn()
	rows, err := db.Query("SELECT id, name, ip, dashboardPort, rpcPort FROM Clusters WHERE id = ?", id)
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}
	var c Cluster
	for rows.Next() {
		scanErr := rows.Scan(&c.ID, &c.Name, &c.IP, &c.DashboardPort, &c.RPCPort)
		if util.CheckHttpError(w, scanErr, "Check DB attribute") {
			return
		}
		break
	}
	rows.Close()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func GetSingleClusterList(w http.ResponseWriter, r *http.Request) {
	db := model.DBConn()

	rows, readErr := db.Query("SELECT id, name, ip, dashboardPort, apiPort, rpcPort, state, date, local FROM Clusters")
	if util.CheckHttpError(w, readErr, "Check DB") {
		return
	}
	defer rows.Close()

	var clusters []Cluster
	checked := make(map[string]bool)

	for rows.Next() {
		var c Cluster
		scanErr := rows.Scan(&c.ID, &c.Name, &c.IP, &c.DashboardPort, &c.APIPort, &c.RPCPort, &c.State, &c.Date, &c.Local)
		if util.CheckHttpError(w, scanErr, "Check DB attribute") {
			return
		}

		hostport := net.JoinHostPort(c.IP, strconv.Itoa(c.RPCPort))
		if _, ok := checked[hostport]; !ok {
			conditionErr := util.CheckCondition(c.IP, c.RPCPort)
			oldState := c.State
			if conditionErr != nil {
				c.State = false
			} else {
				c.State = true
			}

			if oldState != c.State {
				date := time.Now().Format("2006-01-02 15:04:05")
				_, updateErr := db.Exec("UPDATE Clusters SET state = ?, date = ? WHERE ip = ? AND rpcPort = ?", c.State, date, c.IP, c.RPCPort)
				if util.CheckHttpError(w, updateErr, "DB Update Failed") {
					return
				}
			}

			checked[hostport] = true
		}
		clusters = append(clusters, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(clusters)
}

func AddSingleCluster(w http.ResponseWriter, r *http.Request) {
	body, requestErr := ioutil.ReadAll(r.Body)
	if util.CheckHttpError(w, requestErr, "Error reading request body") {
		return
	}

	var clusterInfo map[string]interface{}
	bodyErr := json.Unmarshal(body, &clusterInfo)
	if util.CheckHttpError(w, bodyErr, "Check Body") {
		return
	}
	clusterInfo["dashboardPort"], _ = strconv.Atoi(clusterInfo["dashboardPort"].(string))
	clusterInfo["apiPort"], _ = strconv.Atoi(clusterInfo["apiPort"].(string))
	clusterInfo["rpcPort"], _ = strconv.Atoi(clusterInfo["rpcPort"].(string))

	conditionErr := util.CheckCondition(clusterInfo["ip"].(string), clusterInfo["rpcPort"].(int))
	if util.CheckHttpError(w, conditionErr, "Check MQ's IP or Port") {
		return
	}
	clusterInfo["state"] = true
	clusterInfo["date"] = time.Now().Format("2006-01-02 15:04:05")
	db := model.DBConn()

	_ = godotenv.Load(".env")
	hostIp := os.Getenv("HOST_IP")
	local := false
	if clusterInfo["ip"] == hostIp {
		local = true
	}
	insert, dbInsterErr := db.Query("INSERT INTO Clusters (name, ip, dashboardPort, apiPort, rpcPort, state, date, local) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		clusterInfo["name"], clusterInfo["ip"], clusterInfo["dashboardPort"], clusterInfo["apiPort"], clusterInfo["rpcPort"], clusterInfo["state"], clusterInfo["date"], local)
	if util.CheckHttpError(w, dbInsterErr, "Check data") {
		return
	}
	defer insert.Close()

	fmt.Fprintf(w, "Data Inserted Successfully")
}

func DelSingleCluster(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	db := model.DBConn()
	deleteMessages, err := db.Prepare("DELETE FROM Messages WHERE ClusterId = ?")
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}
	res, err := deleteMessages.Exec(id)
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}
	_, err = res.RowsAffected()
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}

	deleteClusters, err := db.Prepare("DELETE FROM Clusters WHERE id = ?")
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}
	res, err = deleteClusters.Exec(id)
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}
	_, err = res.RowsAffected()
	if util.CheckHttpError(w, err, "Check DB") {
		return
	}

}

func UpdateSingleCluster(w http.ResponseWriter, r *http.Request) {
	fmt.Println(w)
	fmt.Println(r)
	fmt.Fprintln(w, "UpdateMultiClusterList!")
}