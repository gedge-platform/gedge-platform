sudo docker rmi dockereyes/gedge-low-latency-policy &&
sudo docker build -f Dockerfile -t gedge-low-latency-policy . &&
sudo docker tag gedge-low-latency-policy dockereyes/gedge-low-latency-policy &&
sudo docker push dockereyes/gedge-low-latency-policy 
