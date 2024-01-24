#!/bin/sh

sed -i '/^HOST_IP/d' ./backend/.env
echo "\nHOST_IP=`hostname -I | awk '{print $1}'`" >> ./backend/.env
echo "REACT_APP_HOST_IP=`hostname -I | awk '{print $1}'`" > ./frontend/.env
docker-compose up --build 
