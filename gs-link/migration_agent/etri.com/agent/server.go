/*==============================================================================
 *
 *  ELECTRONICS AND TELECOMMUNICATIONS RESEARCH INSTITUTE
 *
 *  COPYRIGHT(c)2021 ELECTRONICS AND TELECOMMUNICATIONS RESEARCH INSTITUTE,
 *  P.O. Box 106, YOUSONG, TAEJON, KOREA
 *  All rights are reserved, No part of this work covered by the copyright
 *  hereon may be reproduced, stored in retrieval systems, in any form or by
 *  any means, electronic, mechanical, photocopying, recording or otherwise,
 *  without the prior permission of ETRI.
 *
 *==============================================================================*/

package agent

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

const (
	dockerContainerPrefix = "docker://"
)

type Server struct {
	config     *Config
	runtimeApi *RuntimeManager
}

func NewServer(config *Config) (*Server, error) {
	fmt.Printf("[KDW] Agent_NewServer Started!!\n")
	runtime, err := NewRuntimeManager(config.DockerEndpoint, config.DockerTimeout)
	if err != nil {
		return nil, err
	}
	return &Server{config: config, runtimeApi: runtime}, nil
}

func (s *Server) Run() error {
	fmt.Printf("[KDW] Agent_server Run called and Started!!\n")
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	mux := http.NewServeMux()
	mux.HandleFunc("/healthCheck", s.HealthCheck)
	mux.HandleFunc("/migratePod", s.migratePod)
	mux.HandleFunc("/clear", s.clear)
	mux.HandleFunc("/restorePod", s.restorePod)
	server := &http.Server{Addr: s.config.ListenAddress, Handler: mux}

	go func() {
		log.Printf("Listening on %s \n", s.config.ListenAddress)

		if err := server.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()
	<-stop

	log.Println("shutting done server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	server.Shutdown(ctx)

	return nil
}

func (s *Server) HealthCheck(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("[KDW] Agent_server HealtheCheck Called!!\n")
	hostName, _ := os.Hostname()
	hostName = "I'm an agent running on " + hostName + "\n"
	w.Write([]byte(hostName))
}

func (s *Server) migratePod(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("[KDW] Agent_server migratedPod Called!!\n")
	containerId := req.FormValue("containerId")
	destHost := req.FormValue("destHost")
	fmt.Println(containerId)
	fmt.Println(destHost)
	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.WithVersion("1.41"))
	if err != nil {
		panic(err)
	}

	// KDW : Shared Folder Version
	err = cli.CheckpointCreate(ctx, containerId, types.CheckpointCreateOptions{
		CheckpointID:  "savedState",
		CheckpointDir: "/mnt/shared_sheepfs/",
		Exit:          false,
	})

	if err != nil {
		panic(err)
	}
	w.Write([]byte("checkpointed " + destHost + "\n"))

}

func (s *Server) clear(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("[KDW] Agent_server Clear Called\n!!")

	cmd := exec.Command("sudo", "rm", "-rf", "/mnt/shared_sheepfs/savedState")
	fmt.Println(cmd)
	stdout, err := cmd.Output()
	fmt.Println(fmt.Sprint(err) + ": " + string(stdout))

}

func (s *Server) restorePod(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("[KDW] Agent_server restorePod Called!!\n")
	err := req.ParseForm()
	if err != nil {
		panic(err)
	}
	containerId := req.FormValue("containerId")
	fmt.Println(containerId)

	containerNames := req.FormValue("containerNames")
	fmt.Println(containerNames)

	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.WithVersion("1.41"))
	if err != nil {
		panic(err)
	}

	// KDW : Shared Folder Version
	err = cli.ContainerPause(ctx, containerId)
	if err != nil {
		panic(err)
	}

	err = cli.ContainerStart(ctx, containerId, types.ContainerStartOptions{
		CheckpointID:  "savedState",
		CheckpointDir: "/mnt/shared_sheepfs/savedState",
	})
	if err != nil {
		panic(err)
	}

	w.Write([]byte("restored " + containerId + "\n"))

}
