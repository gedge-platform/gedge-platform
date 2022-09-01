#!/bin/bash
Secret=`kubectl describe sa -n kube-system root-sa | grep Tokens: | cut -d ' ' -f15`
echo "`kubectl describe secret -n kube-system $Secret | grep token: | cut -d ' ' -f7`"

