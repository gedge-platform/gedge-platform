#!/bin/bash



python3 train.py --batch-size 4 --img 640 640 --data data/person.yaml --cfg yolov4-csp-medium-edit2.yaml --weights '' --sync-bn --device 0 --name yolov4-csp-small2 --epochs 200
#python3 train.py --batch-size 4 --img 640 640 --data data/person.yaml --cfg yolov4-csp-medium-edit.yaml --weights '' --sync-bn --device 0 --name yolov4-csp-medium --epochs 300
#python3 train.py --batch-size 4 --img 640 640 --data data/person.yaml --cfg yolov4-csp-large.yaml --weights '' --sync-bn --device 0 --name yolov4-csp-large --epochs 100

#python3 train.py --batch-size 4 --img 640 640 --data data/person.yaml --cfg yolov4-csp.yaml --weights '' --sync-bn --device 0 --name yolov4-csp --epochs 200
#python3 train.py --batch-size 1 --img 1280 1280 --data data/person.yaml --cfg yolov4-p6.yaml --weights '' --sync-bn --device 0 --name yolov4-p6 --epochs 200
#sleep 2m
#python3 train.py --batch-size 2 --img 896 896 --data data/person.yaml --cfg yolov4-p5.yaml --weights '' --sync-bn --device 0 --name yolov4-p5 --epochs 200

#python3 train.py --batch-size 2 --img 896 896 --data data/person.yaml --cfg yolov4-p5-medium.yaml --weights '' --sync-bn --device 0 --name yolov4-p5-medium --epochs 300
#python3 train.py --batch-size 2 --img 896 896 --data data/person.yaml --cfg yolov4-p5-large.yaml --weights '' --sync-bn --device 0 --name yolov4-p5-large --epochs 300


#python3 train.py --batch-size 4 --img 1280 1280 --data data/person_small.yaml --cfg yolov4-p6.yaml --weights '' --sync-bn --device 0 --name yolov4-p6-small --epochs 100
#python3 train.py --batch-size 1 --img 1280 1280 --data data/person.yaml --cfg yolov4-p6-medium.yaml --weights '' --sync-bn --device 0 --name yolov4-p6-medium --epochs 300
#python3 train.py --batch-size 1 --img 1280 1280 --data data/person.yaml --cfg yolov4-p6-large.yaml --weights './runs/exp30_yolov4-p6-large/weights/last.pt' --sync-bn --device 0 --name yolov4-p6-large --epochs 300


#python3 train.py --batch-size 4 --img 640 640 --data data/person.yaml --cfg yolov4-csp.yaml --weights '' --sync-bn --device 0 --name yolov4-csp --epochs 100
#python3 train.py --batch-size 4 --img 896 896 --data data/person.yaml --cfg yolov4-p5.yaml --weights '' --sync-bn --device 0 --name yolov4-p5 --epochs 100
#python3 train.py --batch-size 4 --img 1280 1280 --data data/person.yaml --cfg yolov4-p6.yaml --weights '' --sync-bn --device 0 --name yolov4-p6 --epochs 100
#python3 train.py --batch-size 2 --img 1536 1536 --data data/person.yaml --cfg yolov4-p7.yaml --weights '' --sync-bn --device 0 --name yolov4-p7 --epochs 50
#python3 train.py --batch-size 2 --img 1536 1536 --data data/person_small.yaml --cfg yolov4-p7.yaml --weights './runs/exp29_yolov4-p7-small/weights/last.pt' --sync-bn --device 0 --name yolov4-p7-small --epochs 50
#python3 train.py --batch-size 2 --img 1536 1536 --data data/person_medium.yaml --cfg yolov4-p7.yaml --weights './runs/exp31_yolov4-p7-medium/last.pt' --sync-bn --device 0 --name yolov4-p7-medium --epochs 50
#python3 train.py --batch-size 2 --img 1536 1536 --data data/person_large.yaml --cfg yolov4-p7.yaml --weights './runs/exp32_yolov4-p7-large/weights/last.pt' --sync-bn --device 0 --name yolov4-p7-large --epochs 50








