package main

import (
	"new-broker/broker"
)

func main() {
	broker.Init()

	wait := make(chan struct{})
	<-wait
}
