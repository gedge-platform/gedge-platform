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
	"fmt"
	"time"

	dockerclient "github.com/docker/docker/client"
)

type RuntimeManager struct {
	client  *dockerclient.Client
	timeout time.Duration
}

func NewRuntimeManager(host string, timeout time.Duration) (*RuntimeManager, error) {
	fmt.Printf("[KDW] Agent_runtime Runtimemanager Called!\n")
	client, err := dockerclient.NewClientWithOpts(dockerclient.WithVersion("1.41"))
	if err != nil {
		return nil, err
	}
	return &RuntimeManager{
		client:  client,
		timeout: timeout,
	}, nil
}
