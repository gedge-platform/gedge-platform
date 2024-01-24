import logging
import asyncio
from contextlib import suppress
from pathlib import Path
from ipaddress import IPv4Network
from kubernetes import config, dynamic, client
from kubernetes.dynamic.exceptions import ResourceNotFoundError
from kubernetes.client import api_client
from main.constants import (
    ALLOCATED,
    DEALLOCATING,
    FREE,
    PHASE,
    POD_IP,
    POD_NAME,
    RESERVED,
    STATUS,
)
from main.models import ippool as ippool_model, ip as ip_model

logger = logging.getLogger("periodic")


class Syncer:
    def __init__(self, interval):
        # self.loop = loop
        self._interval = interval
        self._is_started = False
        self._is_running = False
        self._task = None
        self._handler = None
        self._loop = asyncio.get_event_loop()
        self.kube_config_path = Path(
            "/var/run/secrets/kubernetes.io/serviceaccount/token"
        )
        self.api_version = "crd.projectcalico.org/v1"
        self.kind = "IPReservation"
        self.name = "vk8s-reservation"
        if self.kube_config_path.is_file():
            config.load_incluster_config()
        else:
            config.load_kube_config()
        dynamic_client = dynamic.DynamicClient(api_client.ApiClient())
        self.ipreservation_api = dynamic_client.resources.get(
            api_version=self.api_version, kind=self.kind
        )
        self.client = client
        self.client.rest.logger.setLevel(logging.WARNING)

    async def start(self):
        if not self._is_started:
            self._is_started = True
            self._handler = self._loop.call_later(self._interval, self._run)

    async def stop(self, wait: float = 0):
        if not self._is_started:
            return

        self._is_started = False

        if self._handler:
            self._handler.cancel()
            self._handler = None

        if self._task is None:
            return

        if wait is False:
            wait = None

        with suppress(asyncio.TimeoutError, asyncio.CancelledError):
            await asyncio.wait_for(self._task, wait)

        self._task = None
        self._is_running = False

    def _run(self):
        if not self._is_started:
            return
        self._handler = self._loop.call_later(self._interval, self._run)
        if not self._is_running:
            self._is_running = True
            self._task = asyncio.create_task(self._runner())

    async def _runner(self):
        if not self._is_started:
            return
        try:
            with suppress(asyncio.CancelledError):
                await self._sync()
                logger.debug("syncing vk8s ip address status...")
        except:
            logger.exception("Got all exception during awaiting periodically")
        finally:
            self._is_running = False

    async def _sync(self):
        await self._sync_ippool()
        await self._update_ip_by_ippool()
        await self._sync_ip()

    async def _sync_ip(self):
        v1 = self.client.CoreV1Api()
        # thread = v1.list_namespaced_pod(namespace="default", async_req=True)
        # ret = thread.get()
        ret = v1.list_namespaced_pod(namespace="default")
        k8s_po_list = list(
            ret.items,
        )
        result = await ip_model.get_all()
        current_ip_list = list(map(lambda po: po.status.pod_ip, k8s_po_list))
        # update ip status
        update_ip_list = []
        for db_ip in result:
            pod_ip = db_ip[POD_IP]
            origin_status = db_ip[STATUS]
            origin_pod_name = db_ip[POD_NAME]
            # when pod exists on k8s cluster
            if pod_ip in current_ip_list:
                k8s_ip = self._get_ip(k8s_po_list, pod_ip)
                # print(k8s_ip, db_ip[STATUS])
                if k8s_ip[PHASE] == "Running":
                    status = ALLOCATED
                elif k8s_ip[PHASE] == "Terminating":
                    status = DEALLOCATING
                else:
                    status = db_ip[STATUS]
                pod_name = k8s_ip[POD_NAME]
            # when no pod exists on k8s cluster
            # it means pod_ip must be free or reserved status
            else:
                # only maintain reserved status. Otherwise, change to "free" status
                status = RESERVED if db_ip[STATUS] == RESERVED else FREE
                pod_name = ""
                # if status == RESERVED:
                #     print(pod_ip, status, pod_name)
            if origin_status != status or origin_pod_name != pod_name:
                update_ip_list.append(
                    {POD_IP: pod_ip, STATUS: status, POD_NAME: pod_name}
                )
        await ip_model.update_ips(update_ip_list)

    async def _sync_ippool(self):
        try:
            ipreservation = self.ipreservation_api.get(name=self.name)
            ippool_list = set(list(ipreservation.spec.reservedCIDRs))
            current_ippool_list = set(await ippool_model.get_all())
            new_ippool_list = list(ippool_list - current_ippool_list)
            await ippool_model.create_all(new_ippool_list)
            will_deleted_list = list(current_ippool_list - ippool_list)
            await ippool_model.delete_ippools(will_deleted_list)
        except ResourceNotFoundError as e:
            logging.error(e)

    async def _update_ip_by_ippool(self):
        current_ippool_list = await ippool_model.get_all()
        current_ippool_list = list(map(IPv4Network, current_ippool_list))
        current_ip_list = list(
            map(lambda ip: ip[POD_IP], await ip_model.get_all())
        )
        total_ip_list = []
        for ippool in current_ippool_list:
            total_ip_list.extend(str(ip) for ip in ippool)
        new_ip_list = list(set(total_ip_list) - set(current_ip_list))
        new_db_ip_list = []
        for new_ip in new_ip_list:
            new_db_ip_list.append({POD_IP: new_ip, STATUS: FREE, POD_NAME: ""})
        await ip_model.create_ips(new_db_ip_list)

        delete_ip_list = list(set(current_ip_list) - set(total_ip_list))
        # print(delete_ip_list)
        await ip_model.delete_ips(delete_ip_list)

    def _get_ip(self, ip_list, pod_ip):
        for ip in ip_list:
            if ip.status.pod_ip == pod_ip:
                phase = ip.status.phase
                if ip.metadata.deletion_timestamp is not None:
                    phase = "Terminating"
                return {
                    POD_IP: ip.status.pod_ip,
                    POD_NAME: ip.metadata.name,
                    PHASE: phase,
                }
        return None
