sudo docker rmi dockereyes/gedge-select-cluster-policy &&
sudo docker build -f Dockerfile -t gedge-select-cluster-policy . &&
sudo docker tag gedge-select-cluster-policy dockereyes/gedge-select-cluster-policy &&
sudo docker push dockereyes/gedge-select-cluster-policy