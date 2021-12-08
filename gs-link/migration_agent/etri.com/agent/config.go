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
	"io/ioutil"
	"time"

	"gopkg.in/yaml.v2"
)

var (
	DefaultConfig = Config{
		DockerEndpoint:        "unix:///var/run/docker.sock",
		DockerTimeout:         30 * time.Second,
		StreamIdleTimeout:     10 * time.Minute,
		StreamCreationTimeout: 15 * time.Second,

		ListenAddress: "0.0.0.0:15213",
	}
)

type Config struct {
	DockerEndpoint        string        `yaml:"docker_endpoint,omitempty"`
	DockerTimeout         time.Duration `yaml:"docker_timeout,omitempty"`
	StreamIdleTimeout     time.Duration `yaml:"stream_idle_timeout,omitempty"`
	StreamCreationTimeout time.Duration `yaml:"stream_creation_timeout,omitempty"`

	ListenAddress string `yaml:"listen_address,omitempty"`
}

func Load(s string) (*Config, error) {
	cfg := &Config{}

	//  DefaultConfig at the entry point as well.
	*cfg = DefaultConfig

	err := yaml.UnmarshalStrict([]byte(s), cfg)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}

func LoadFile(filename string) (*Config, error) {
	if len(filename) < 1 {
		return &DefaultConfig, nil
	}
	c, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return Load(string(c))
}
