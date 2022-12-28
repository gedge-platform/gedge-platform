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
	"etri.com/plugin"
	"os"
)

//kubectl plugin migration
func main() {
	cmd := plugin.NewPluginCmd()
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
