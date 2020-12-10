import socket
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    temp_hostname=str(socket.gethostname())
    return_str = "hostname is < " + temp_hostname +" >"
    return return_str

if __name__ == "__main__":
    app.run(host='0.0.0.0')
