#!/bin/bash
# RELEASE="v1.16.15"
# RELEASE="v1.17.17"
# RELEASE="v1.18.20"
# RELEASE="v1.19.16"
# RELEASE="v1.20.15"
# RELEASE="v1.21.7"
# RELEASE="v1.22.13"
# RELEASE="v1.23.10"
# RELEASE="v1.24.4"
while getopts r:v:f:t: flag
do
    case "${flag}" in
        r) registry=${OPTARG};;
        v) version=${OPTARG};;
        f) fileName=${OPTARG};;
        t) tag=${OPTARG};;
    esac
done

echo $registry
if [ -z "$registry" ]
then
    registry="10.40.103.111:15001"
fi
registry="$registry/scale/workflow/vk8s"
if [ -z "$version" ] # k8s 버전이 명시되어 있지 않을 때
then
    if [ -z "$tag" ]
    then
        image_tag="latest"
    else
        image_tag=$tag
    fi
    k8s_version=$(curl -sSL https://dl.k8s.io/release/stable.txt)
else # k8s 버전이 명시되어 있을 때
    if [ "$(expr $version : 'v[0-9]\.[0-9]\{2\}\.[0-9]\{1,2\}')" = 0 ] # k8s 버전이 틀리게 적혀있는지 확인
    then
        echo "Kubenretes version $version is incorrect.
Please enter kubernetes version correctly 'ex) v1.19.15'"
        exit 1
    fi
    
    if [ -z "$tag" ] # 이미지 tag가 명시되어 있지 않을 때
        then
            image_tag=`expr "$version" : '\(v[0-9]\.[0-9]*\)'`
        else # 이미지 tag가 명시되어 있을 때
            image_tag=$tag
    fi
    k8s_version=$version
fi



if [ -z "$fileName" ]
then
    dockerfile="dockerfiles/Dockerfile"
else
    dockerfile="dockerfiles/$fileName"
fi

echo "image registry : $registry"
echo "image tag : $image_tag"
echo "kubernetes version : $k8s_version"
echo "dockerfile : $dockerfile"
# registry="10.40.103.111:15001/scale/workflow/vk8s"
# registry="192.168.202.201:15001/scale/workflow/vk8s"
# registry="dudaji"

# sudo docker build -t $registry/scale/workflow/vk8s/kink:$image_tag --build-arg K8S_RELEASE_VERSION=$k8s_version -f $dockerfile .
# sudo docker push $registry/scale/workflow/vk8s/kink:$image_tag
sudo DOCKER_BUILDKIT=1 docker build -t $registry/kink:$image_tag --build-arg K8S_RELEASE_VERSION=$k8s_version -f $dockerfile .
sudo DOCKER_BUILDKIT=1  docker push $registry/kink:$image_tag
