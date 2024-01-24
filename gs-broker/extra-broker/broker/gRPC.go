package broker

import (
	"context"
	"log"
	"net"
	"new-broker/gsgRPC"
	"new-broker/mq"
	"new-broker/util"

	"google.golang.org/grpc"
)

type GRPCServer struct{}

func (s *GRPCServer) SayGs(ctx context.Context, in *gsgRPC.GsRequest) (*gsgRPC.GsResponse, error) {
	mq.PublishToRabbitMQ(in.Greeting, "edge.gRPC.exchange")
	log.Printf("Published message to RabbitMQ(gRPC): %s", in.Greeting)

	return &gsgRPC.GsResponse{Reply: "Published : " + in.Greeting}, nil
}

func RunGRPCServer() {
	lis, err := net.Listen("tcp", ":50051")
	util.CheckRuntimeError(err, "listen error")

	s := grpc.NewServer()
	gsgRPC.RegisterGsServiceServer(s, &GRPCServer{})
	log.Println("gRPC server on 50051...")
	err = s.Serve(lis)
	util.CheckRuntimeError(err, "Serve error")
}
