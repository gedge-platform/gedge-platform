import json
import logging as log
from quart import request
from main.controllers import ip_bp
from main.controllers import jsonize
from main.services import ip


@ip_bp.route("/ip", methods=["GET"])
async def get_all_ips():
    log.debug("try to get all ips")
    return jsonize(await ip.get_all_ips())


@ip_bp.route("/free-ip", methods=["GET"])
async def get_random_free_ip():
    log.debug("try to get random free ip")
    return jsonize(await ip.get_random_free_ip())


@ip_bp.route("/free-ips", methods=["GET"])
async def get_free_ips():
    log.debug("try to get free ips")
    return jsonize(await ip.get_free_ips())


@ip_bp.route("/ip", methods=["POST"])
async def create_ip():
    body = await request.get_data()
    body = json.loads(body)
    pod_ip = body["pod_ip"]
    status = body["status"]
    pod_name = body["pod_name"]
    log.debug(f"try to create {pod_ip}")
    return jsonize(await ip.create_ip(pod_ip, status, pod_name))


@ip_bp.route("/ip", methods=["PUT"])
async def update_ip():
    body = await request.get_data()
    body = json.loads(body)
    pod_ip = body["pod_ip"]
    status = body["status"]
    pod_name = body["pod_name"]
    log.debug(f"try to update ip {pod_ip} status to {status}")
    return jsonize(await ip.update_ip(pod_ip, status, pod_name))


@ip_bp.route("/ip/<pod_ip>", methods=["DELETE"])
async def delete_ip(pod_ip: str):
    log.debug(f"try to delete {pod_ip}")
    return jsonize(await ip.delete_ip(pod_ip))
