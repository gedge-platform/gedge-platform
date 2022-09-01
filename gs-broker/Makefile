image_name=10.0.0.255:5000/gedge-platform/message-broker:1.4 # add stomp plugin
container_name=rabbitmq

#### docker #####
build-docker:
	docker build -f docker/Dockerfile -t $(image_name) . --network=host

run-docker:
	docker run -it -d -p 5672:5672 -p 15672:15672 -p 1883:1883 --shm-size=8G --init --name $(container_name) $(image_name)

exec-docker:
	docker exec -it $(container_name) /bin/bash

rm-docker:
	docker stop $(container_name) && docker rm $(container_name)
#################

