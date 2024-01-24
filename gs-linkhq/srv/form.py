from flask import Flask,render_template,request
import requests
import json
import os
from monitor import monitor, get_info
from agent.dqn import DQN
import torch

MONITOR_ADDR = os.environ.get('SERVER_IP')
MONITOR_PORT = os.environ.get('SERVER_PORT')

AUTH_ID = os.environ.get('AUTH_ID')
AUTH_PW = os.environ.get('AUTH_PW')

app = Flask(__name__)

if '://' in MONITOR_ADDR:
    monitor_url = MONITOR_ADDR
else:
    monitor_url = 'http://' + MONITOR_ADDR

len_state, num_action, edges = get_info(MONITOR_ADDR, MONITOR_PORT, AUTH_ID, AUTH_PW)

agent = DQN(len_state, num_action, eps_start=0, eps_end=0, eps_decay=0, weight='weights/offload.pt')

@app.route('/offload')
def offload():
    return render_template('offload.html', edges = enumerate(edges))

@app.route('/cache')
def cache():
    return render_template('cache.html', edges = enumerate(edges))
 
@app.route('/result/', methods = ['POST', 'GET'])
def data():
    if request.method == 'GET':
        return f"The URL /result is accessed directly. Try going to '/' to submit form"

    if request.method == 'POST':
        form_data = request.form
        data = list(dict(form_data).values())
        subject = "Offloading"


        if len(data) == 5:
            data.append(data[-1])
            data[-2] = 0
        elif len(data) == 3:
            data = ([0] * 2) + [data[0]] + [0] + data[-2:]
            subject = "Caching"
        elif len(data) == 2:
            data = ([0] * 2) + [data[0]] + ([0] * 2) + [data[-1]]
            subject = "Caching"
        
        floatdata = []
        for i in data:
            floatdata.append(float(i))
        one_hot = [0] * num_action
        one_hot[int(floatdata[-1])] = 1
        req_resource = floatdata[:-1]
        state = one_hot + req_resource + monitor(MONITOR_ADDR, MONITOR_PORT, AUTH_ID, AUTH_PW)

        print('state:', state)
        res = agent.select_action(state)
        print(res)
        action = res.item()
        print('action:', action)
        result = edges[action]

        return render_template('result.html', subject=subject, form_data=form_data, result=result)
 
 
app.run(host='0.0.0.0', port=5555, debug=True)