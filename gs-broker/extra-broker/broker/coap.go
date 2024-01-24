package broker

import (
	"log"

	"new-broker/mq"
	"new-broker/util"

	"github.com/go-ocf/go-coap"
)

type CoAPHandler struct{}

func (c *CoAPHandler) ServeCOAP(w coap.ResponseWriter, req *coap.Request) {
	message := string(req.Msg.Payload())

	mq.PublishToRabbitMQ(message, "edge.coap.exchange")

	log.Printf("Published message to RabbitMQ(coap): %s", message)

	w.SetContentFormat(coap.TextPlain)
	w.Write([]byte("Published : " + message))
}

func RunCoAPServer() {
	mux := coap.NewServeMux()
	mux.Handle("/coap", &CoAPHandler{})
	log.Println("CoAP server on 50050...")
	err := coap.ListenAndServe("udp", ":50050", mux, nil)
	util.CheckRuntimeError(err, "listen error")
}
