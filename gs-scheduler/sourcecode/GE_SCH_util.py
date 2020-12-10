import socket
import GE_SCH_define


def get_hostnode_info():
    return_dic = {}
    ## getting the hostname by socket.gethostname() method
    hostname = socket.gethostname()
    ## getting the IP address using socket.gethostbyname() method
    ip_address = socket.gethostbyname(hostname)
    ## printing the hostname and ip_address
    try:
        return_dic["hostname"] = hostname
        return_dic["ip_address"] = ip_address
        #print("Hostname:", hostname)
        #print("IP Address:", ip_address)
    except:
        return None
    return return_dic



