import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
import GE_define as gDefine

import socket
from   kubernetes import client, config

def get_hostname_and_ip():
    return_dic = {}
    ## getting the hostname by socket.gethostname() method
    hostname = socket.gethostname()
    ## getting the IP address using socket.gethostbyname() method
    #ip_address = socket.gethostbyname(hostname)
    ip_address = socket.gethostbyname(socket.getfqdn())
    ## printing the hostname and ip_address
    try:
        return_dic["hostname"] = hostname
        return_dic["ip_address"] = ip_address
        print("Hostname:", hostname)
        print("IP Address:", ip_address)
    except:
        return None
    return return_dic





