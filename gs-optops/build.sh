#!/bin/bash
# RELEASE="v1.16.15"
# RELEASE="v1.17.17"
# RELEASE="v1.19.15"
# RELEASE="v1.20.13"
# RELEASE="v1.21.7"
# RELEASE="v1.22.4"
# RELEASE="v1.23.0"
while getopts v:f:t: flag
do
    case "${flag}" in
        v) version=${OPTARG};;
        f) fileName=${OPTARG};;
        t) tag=${OPTARG};;
    esac
done

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
    dockerfile="Dockerfile"
else
    dockerfile=$fileName
fi

echo "image tag : $image_tag"
echo "kubernetes version : $k8s_version"
echo "dockerfile : $dockerfile"

docker build -t dudaji/kink:$image_tag --build-arg K8S_RELEASE_VERSION=$k8s_version -f $dockerfile .
docker push dudaji/kink:$image_tag