from main.models import ip as model


async def get_all_ips():
    return await model.get_all()

async def get_free_ips():
    return await model.get_free_ips()

async def create_ip(pod_ip, status, pod_name):
    return await model.create_ip(pod_ip, status, pod_name)

async def update_ip(pod_ip, status, pod_name):
    return await model.update_ip(pod_ip, status, pod_name)

async def delete_ip(pod_ip):
    return await model.delete_ip(pod_ip)

async def get_random_free_ip():
    return await model.get_random_free_ip()