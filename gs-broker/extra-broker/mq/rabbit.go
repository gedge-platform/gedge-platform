package mq

import (
	"new-broker/util"

	"github.com/streadway/amqp"
)

func connectToRabbitMQ() (*amqp.Connection, *amqp.Channel) {
	conn, err := amqp.Dial("amqp://admin:admin@localhost:5372/VHOST")
	util.CheckRuntimeError(err, "Failed to connect to RabbitMQ Check Dial IP")

	ch, err := conn.Channel()
	util.CheckRuntimeError(err, "Failed to open a channel")

	return conn, ch
}

func PublishToRabbitMQ(message string, exchange string) {
	conn, ch := connectToRabbitMQ()
	defer conn.Close()
	defer ch.Close()

	err := ch.ExchangeDeclare(
		exchange,
		"direct",
		true,
		false,
		false,
		false,
		nil,
	)
	util.CheckRuntimeError(err, "Failed to declare an exchange")

	err = ch.Publish(
		exchange,
		"",
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(message),
		})
	util.CheckRuntimeError(err, "Failed to publish a message")
}

