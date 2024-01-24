#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./build-bulk.sh <image-registry>"
  exit -1
fi
registry=$1

# replace registry from user
file_list=("files/etc/docker/daemon.json" "files/etc/docker/daemon.gpu.json" "files/kfp-proxy/k8s-deployment.yaml" "files/nvidia-device-plugin.yml")
for file in "${file_list[@]}"
do
  sed -i "s@registry@$registry@g" $file
done
# push kfp-proxy image
sudo docker pull dudaji/kfp-proxy:latest
sudo docker tag dudaji/kfp-proxy:latest $registry/scale/workflow/vk8s/kfp-proxy:latest
sudo docker push $registry/scale/workflow/vk8s/kfp-proxy:latest

# build and push vnode images in background for all kubernetes version
k8s_versions=("v1.19.16" "v1.20.15" "v1.21.14" "v1.22.17" "v1.23.17")
for version in "${k8s_versions[@]}"
do 
  image_tag=`expr "$version" : '\(v[0-9]\.[0-9]*\)'`-ubuntu
  gpu_image_tag="${image_tag}-gpu"
  nohup ./build.sh -r $registry -v $version -t $image_tag -f Dockerfile.ubuntu &
  nohup ./build.sh -r $registry -v $version -t $gpu_image_tag -f Dockerfile.ubuntu.gpu &
done
