package util

import (
	"context"
	"time"

	"github.com/kubemq-io/kubemq-go"
)

func CheckCondition(ip string, port int) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*1)
	defer cancel()

	client, mqErr := kubemq.NewClient(ctx, kubemq.WithAddress(ip, port))
	if mqErr != nil {
		return mqErr
	}

	_, pingErr := client.Ping(ctx)
	if pingErr != nil {
		return pingErr
	}

	return nil
}
