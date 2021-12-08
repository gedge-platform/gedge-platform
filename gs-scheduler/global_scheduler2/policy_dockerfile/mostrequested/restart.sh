sudo docker rmi dockereyes/gedge-most-requested-policy &&
sudo docker build -f Dockerfile -t gedge-most-requested-policy . &&
sudo docker tag gedge-most-requested-policy dockereyes/gedge-most-requested-policy &&
sudo docker push dockereyes/gedge-most-requested-policy 