import datetime
import json
import os
import sys
import paho.mqtt.client as mqtt
import multiprocessing
import grpc
if sys.version_info >= (3, 0):
    from http.server import BaseHTTPRequestHandler, HTTPServer
else:
    from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

from pb.gsgateway_pb2
from pb.gsgateway_pb2_grpc

# define
TOPIC_NAME = "gRPC"
GATEWAY = "[GW_SERVER_ADDRESS]" # "10.0.0.183:31113"
GATEWAY_IP = "[GW_SERVER_IP]" # "10.0.0.183"
GATEWAY_PORT =  "[GW_PORT_NUMBER]" # "31113"

if len(sys.argv) < 2:
    print("Input Command : python message-broker.py [SERVERLESS_FUNCTION_NAME]")
    sys.exit()

class MyHandler(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
        s.wfile.write(bytes("<html><head><title>GET response</title></head>\n", "utf-8"))
        s.wfile.write(bytes("</body></html>\n", "utf-8"))
    def do_POST(s):
        content_length = int(s.headers['Content-Length'])
        post_data = s.rfile.read(content_length)
        print("===========HTTP===========")
        print(s.headers)
        print(post_data.decode())
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
def HTTP_Receiver():
    httpd = HTTPServer((GATEWAY_IP, []), MyHandler)
    try:
        print ("HTTP Server Start - " + GATEWAY_IP + " : " + GATEWAY_PORT)
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

def MQTT_Receiver():
    client = mqtt.Client()
    client.connect(GATEWAY_IP)
    # register subscribe 
    def on_connect(client, userdata, flags, rc):
        print("Using gateway {} and topic {}".format(GATEWAY, TOPIC_NAME))
        client.subscribe(TOPIC_NAME)

    def on_message(client, userdata, msg):
        # gRPC 
        channel = grpc.insecure_channel(GATEWAY)
        stub = pb.gsgateway_pb2_grpc.GsGatewayStub(channel)
        servicerequest = pb.gsgateway_pb2.InvokeServiceRequest(Service=sys.argv[1], Input=str(msg.payload.decode("utf-8")))
        r = stub.Invoke(servicerequest)
        print(r.Msg)
    client.on_connect = on_connect
    client.on_message = on_message
    client.loop_forever()

if __name__ == '__main__':
    process_mqtt_receiver = multiprocessing.Process(target=MQTT_Receiver)
    process_mqtt_receiver.daemon = True
    process_mqtt_receiver.start()
    process_http_receiver = multiprocessing.Process(target=HTTP_Receiver)
    process_http_receiver.daemon = True
    process_http_receiver.start()
    process_http_receiver.join()
    process_mqtt_receiver.join()
