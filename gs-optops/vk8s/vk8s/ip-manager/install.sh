#!/bin/bash
if [ $# -ne 3 ]; then
  echo "Usage: ./install.sh <namespace> <image-registry> <ip-reservation-range>"
  exit -1
fi
namespace=$1
registry=$2
ipRange=$3
echo namespace: $namespace
echo registry: $registry
echo ipRange: $ipRange 

# build ip-manager
./build.sh $registry latest

# push mysql:5.6
sudo docker pull mysql:5.6
sudo docker tag mysql:5.6 $registry/scale/workflow/vk8s/mysql:5.6
sudo docker push $registry/scale/workflow/vk8s/mysql:5.6

# install IPReservation, IP-Manager, Mysql
sed "s@registry@$registry@g" yamls/ip-manager.yaml | kubectl apply -n $namespace -f -
sed "s@ipRange@$ipRange@g" yamls/ip-reservation.yaml | kubectl apply -n $namespace -f -
sed "s/registry/$registry/g" yamls/mysql.yaml | kubectl apply -n $namespace -f -