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

package main

import (
	"fmt"
	"log"
	"os"

	"etri.com/agent"
)

func main() {
	server, err := agent.NewServer(&agent.DefaultConfig)

	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	fmt.Printf("[KDW]Agent_NewServer Started!!\n")

	if err := server.Run(); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	fmt.Printf("[KDW]Agent_NewServer Started to run!!\n")
}
