package com.innogrid.gedge.apiopenstack.controller;

import com.innogrid.gedge.apiopenstack.service.EdgeService;
import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.core.model.MeterServerAccumulateInfo;
import com.innogrid.gedge.core.model.MeterServerInfo;
import com.innogrid.gedge.core.util.AES256Util;
import com.innogrid.gedge.core.util.ObjectSerializer;
import com.innogrid.gedge.coredb.service.MeterService;
import com.innogrid.gedge.coreedge.model.*;
import org.openstack4j.model.compute.InterfaceAttachment;
import org.openstack4j.model.compute.ext.Hypervisor;
import org.openstack4j.model.compute.ext.HypervisorStatistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wss on 19. 7. 10.
 */
@Controller
//@RequestMapping("/infra/cloudServices/openstack")
public class EdgeController {
    private static Logger logger = LoggerFactory.getLogger(EdgeController.class);

    @Autowired
    private EdgeService edgeService;

    @Autowired
    private MeterService meterService;

    @Autowired
    private AES256Util aes256Util;

    @RequestMapping(value = "/zones", method = RequestMethod.GET)
    @ResponseBody
    public List<AvailabilityZoneInfo> getZones(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @RequestParam String type
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getZones(credentialInfo, project, type);
    }

    @RequestMapping(value = "/servers", method = RequestMethod.GET)
    @ResponseBody
    public List<ServerInfo> getServers(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getServers(credentialInfo, project);
    }

    @RequestMapping(value = "/servers/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ServerInfo getServers(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String id
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getServer(credentialInfo, project, id);
    }

    @RequestMapping(value = "/flavors", method = RequestMethod.GET)
    @ResponseBody
    public List<FlavorInfo> getFlavors(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getFlavors(credentialInfo, project);
    }

    @RequestMapping(value = "/images", method = RequestMethod.GET)
    @ResponseBody
    public List<ImageInfo> getImages(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @RequestParam(defaultValue = "false") Boolean active
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getImages(credentialInfo, project, active);
    }

    @RequestMapping(value = "/keypairs", method = RequestMethod.GET)
    @ResponseBody
    public List<KeyPairInfo> getKeyPairs(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getKeyPairs(credentialInfo, project);
    }

    @RequestMapping(value = "/volumes", method = RequestMethod.GET)
    @ResponseBody
    public List<VolumeInfo> getVolumes(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @RequestParam(defaultValue = "false") Boolean bootable,
            @RequestParam(defaultValue = "false") Boolean available
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getVolumes(credentialInfo, project, bootable, available);
    }

    @RequestMapping(value = "/volumes/{id}", method = RequestMethod.GET)
    @ResponseBody
    public VolumeInfo getVolume(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String volumeId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getVolume(credentialInfo, project, volumeId);
    }

    @RequestMapping(value = "/backups", method = RequestMethod.GET)
    @ResponseBody
    public List<VolumeBackupInfo> getBackups(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getBackups(credentialInfo, project);
    }

    @RequestMapping(value = "/snapshots", method = RequestMethod.GET)
    @ResponseBody
    public List<VolumeSnapshotInfo> getSnapshots(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getSnapshots(credentialInfo, project);
    }

    @RequestMapping(value = "/networks", method = RequestMethod.GET)
    @ResponseBody
    public List<NetworkInfo> getNetworks(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getNetworks(credentialInfo, project);
    }

    @RequestMapping(value = "/routers", method = RequestMethod.GET)
    @ResponseBody
    public List<RouterInfo> getRouters(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getRouters(credentialInfo, project);
    }

    @RequestMapping(value = "/securitygroups", method = RequestMethod.GET)
    @ResponseBody
    public List<SecurityGroupInfo> getSecurityGroups(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getSecurityGroups(credentialInfo, project);
    }

    @RequestMapping(value = "/floatingips", method = RequestMethod.GET)
    @ResponseBody
    public List<FloatingIpInfo> getFloatingIps(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @RequestParam(defaultValue = "false") Boolean down
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getFloatingIps(credentialInfo, project, down);
    }

    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    @ResponseBody
    public List<ProjectInfo> getProjects(
            @RequestHeader(value = "credential") String credential
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getProjects(credentialInfo);
    }

    @RequestMapping(value = "/projects/{projectId}", method = RequestMethod.GET)
    @ResponseBody
    public ProjectInfo getProjects(
            @RequestHeader(value = "credential") String credential,
            @PathVariable(value = "projectId") String project
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getProject(credentialInfo, project);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo createServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @RequestBody CreateServerInfo createServerInfo
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.createServer(credentialInfo, project, createServerInfo);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/start", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo startServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.start(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/stop", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo stopServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.stop(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/reboot", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo rebootServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId,
            @RequestParam(required = false, defaultValue = "false") Boolean hard
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        if(!hard) {
            return edgeService.rebootSoft(credentialInfo, project, serverId);
        } else {
            return edgeService.rebootHard(credentialInfo, project, serverId);
        }
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/delete", method = RequestMethod.POST)
    public @ResponseBody ServerInfo deleteServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.delete(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/pause", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo pauseServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.pause(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/unpause", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo unpauseServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.unpause(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/lock", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo lockServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.lock(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/unlock", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo unlockServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.unlock(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/suspend", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo suspendServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.suspend(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/resume", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo resumeServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.resume(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/rescue", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo rescueServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.rescue(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/unrescue", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo unrescueServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.unrescue(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/shelve", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo shelveServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.shelve(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/shelveoffload", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo shelveOffloadServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.shelveOffload(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/unshelve", method = RequestMethod.POST)
    public @ResponseBody
    ServerInfo unshelveServer(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.unshelve(credentialInfo, project, serverId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/servers/{id}/snapshot", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, String> createServerSnapshot(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId,
            @RequestBody Map<String, String> param
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        String imageId = edgeService.createServerSnapshot(credentialInfo, project, serverId, param.get("name"));

        return new HashMap<String, String>(){{
            put("imageId", imageId);
        }};
    }

    @RequestMapping(value = "/servers/{id}/log", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, String> getServerLog(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId,
            @RequestParam(value = "line") int line
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        String log = edgeService.getServerConsoleOutput(credentialInfo, project, serverId, line);

        return new HashMap<String, String>(){{
            put("log", log);
        }};
    }

    @RequestMapping(value = "/servers/{id}/console", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, String> getServerConsole(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        String vncUrl = edgeService.getServerVNCConsoleURL(credentialInfo, project, serverId);

        return new HashMap<String, String>(){{
            put("url", vncUrl);
        }};
    }

    @RequestMapping(value = "/servers/{id}/metric", method = RequestMethod.GET)
    @ResponseBody
    public Object getServerMetric(
            @RequestHeader(value = "credential") String credential,
            @PathVariable(value = "id") String serverId,
            @RequestParam(value = "metricName") Integer metricName,
            @RequestParam(value = "statistic") String statistic,
            @RequestParam(value = "interval") Integer interval,
            @RequestParam(value = "endDate") Long endDate,
            @RequestParam(value = "startDate") Long startDate
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        RequestMetricInfo requestMetricInfo = new RequestMetricInfo();
        requestMetricInfo.setId(serverId);
        requestMetricInfo.setMetricName(metricName);
        requestMetricInfo.setStatistic(statistic);
        requestMetricInfo.setInterval(interval);
        requestMetricInfo.setEndDate(endDate);
        requestMetricInfo.setStartDate(startDate);

        return edgeService.getServerMetric(credentialInfo, requestMetricInfo);
    }

    @RequestMapping(value = "/servers/{id}/action", method = RequestMethod.GET)
    @ResponseBody
    public List<ActionLogInfo> getActions(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getServerActionLog(credentialInfo, project, serverId);
    }

    @RequestMapping(value = "/servers/{id}/volumes", method = RequestMethod.GET)
    @ResponseBody
    public List<VolumeInfo> getServerVolumes(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getServerVolumes(credentialInfo, project, serverId);
    }

    @RequestMapping(value = "/servers/{id}/volumes/{volumeId}", method = RequestMethod.POST)
    @ResponseBody
    public VolumeInfo actionServerVolume(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId,
            @RequestBody Map<String, String> action,
            @PathVariable(value = "volumeId") String volumeId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        if(action.get("action").equals("ATTACH_VOLUME")) {
            return edgeService.attachVolume(credentialInfo, project, serverId, volumeId);
        }  else if(action.get("action").equals("DETACH_VOLUME")) {
            return edgeService.detachVolume(credentialInfo, project, serverId, volumeId);
        } else {
            return new VolumeInfo();
        }
    }

    @RequestMapping(value = "/servers/{id}/interface", method = RequestMethod.GET)
    @ResponseBody
    public List<? extends InterfaceAttachment> getServerInterfaces(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getServerInterface(credentialInfo, project, serverId);
    }

    @RequestMapping(value = "/servers/{id}/interface", method = RequestMethod.POST)
    @ResponseBody
    public ServerInfo actionServerInterface(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId,
            @RequestBody Map<String, String> action
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        Boolean result = false;

        if(action.get("action").equals("ATTACH_INTERFACE")) {
            result = edgeService.attachInterface(credentialInfo, project, serverId, action.get("networkId"));
        } else if(action.get("action").equals("DETACH_INTERFACE")) {
            result =  edgeService.detachInterface(credentialInfo, project, serverId, action.get("portId"));
        }

        if(result) {
            return edgeService.getServer(credentialInfo, project, serverId);
        }

        return new ServerInfo();
    }

    @RequestMapping(value = "/servers/{id}/floatingip", method = RequestMethod.POST)
    @ResponseBody
    public ServerInfo actionServerFloatingIp(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "id") String serverId,
            @RequestBody Map<String, String> action
            ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        Boolean result = false;

        if(action.get("action").equals("CONNECT_FLOATING_IP")) {
            result = edgeService.addFloatingIpToServer(credentialInfo, project, serverId, action.get("interfaceIp"), action.get("floatingIp"));
        } else if(action.get("action").equals("DISCONNECT_FLOATING_IP")) {
            result = edgeService.removeFloatingIpToServer(credentialInfo, project, serverId, action.get("floatingIp"));
        }

        if(result) {
            return edgeService.getServer(credentialInfo, project, serverId);
        }

        return new ServerInfo();
    }

    @RequestMapping(value = "/resource", method = RequestMethod.GET)
    @ResponseBody
    public ResourceInfo getUsage(
            @RequestHeader(value = "credential") String credential
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getResourceUsage(credentialInfo);
    }

    @RequestMapping(value = "/hypervisors", method = RequestMethod.GET)
    @ResponseBody
    public List<? extends Hypervisor> getHypervisors(
            @RequestHeader(value = "credential") String credential
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getHypervisors(credentialInfo);
    }

    @RequestMapping(value = "/hypervisorstatistics", method = RequestMethod.GET)
    @ResponseBody
    public HypervisorStatistics getHypervisorStatistics(
            @RequestHeader(value = "credential") String credential
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getHypervisorStatistics(credentialInfo);
    }

    @RequestMapping(value = "/floatingippools", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getFloatingIpPoolNames(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.getFloatingIpPoolNames(credentialInfo, project);
    }

    @RequestMapping(value = "/floatingip", method = RequestMethod.POST)
    @ResponseBody
    public FloatingIpInfo allocateFloatingIp(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @RequestBody Map<String, String> params
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return edgeService.allocateFloatingIp(credentialInfo, project, params.get("poolName"));
    }

    @RequestMapping(value = "/floatingip/{floatingIpId}", method = RequestMethod.DELETE)
    public void deallocateFloatingIp(
            @RequestHeader(value = "credential") String credential,
            @RequestParam(required = false) String project,
            @PathVariable(value = "floatingIpId") String floatingIpId
    ) {
        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        edgeService.deallocateFloatingIp(credentialInfo, project, floatingIpId);
    }

    @RequestMapping(value = "/meter/servers", method = RequestMethod.GET)
    @ResponseBody
    public List<MeterServerAccumulateInfo> getMeterServerAccumulateInfos(
            @RequestHeader(value = "credential") String credential
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return meterService.getMeterServerAccumulates(new HashMap<String, Object>(){{
            put("cloudTarget", credentialInfo.getUrl());
        }});
    }

    @RequestMapping(value = "/meter/servers/{serverId}", method = RequestMethod.GET)
    @ResponseBody
    public List<MeterServerInfo> getMeterServerInfos(
            @RequestHeader(value = "credential") String credential,
            @PathVariable(value = "serverId") String serverId
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return meterService.getMeterServers(new HashMap<String, Object>(){{
            put("cloudTarget", credentialInfo.getUrl());
            put("instanceId", serverId);
        }});
    }

    @RequestMapping(value = "/validate", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Boolean> checkValidate(
            @RequestHeader(value = "credential") String credential
    ) {

        CredentialInfo credentialInfo = ObjectSerializer.deserializedData(aes256Util.decrypt(credential));

        return new HashMap<String, Boolean> (){{
            put("result", edgeService.validateCredential(credentialInfo));
        }};
    }

    @RequestMapping(value = "/getmasternode", method = RequestMethod.GET)
    @ResponseBody
    public Nodeinfo getMasterNode(
    ) {

        logger.error("-------- getmasternode --------");

        return edgeService.getMasterNode();
    }

    @RequestMapping(value = "/gettotalnode", method = RequestMethod.GET)
    @ResponseBody
    public Nodeinfo getTotalNode(
    ) {

        logger.error("-------- getTotalNode --------");

        return edgeService.getTotalNode();
    }

    @RequestMapping(value = "/getEdge", method = RequestMethod.GET)
    @ResponseBody
    public Object getEdge(
    ) {

        logger.error("-------- getEdge --------");

        return edgeService.getEdge();
    }

    @RequestMapping(value = "/getPods", method = RequestMethod.GET)
    @ResponseBody
    public PodInfo getPods(
    ) {

        logger.error("-------- getPods --------");

        return edgeService.getPods();
    }

    @RequestMapping(value = "/getNodeUsage", method = RequestMethod.GET)
    @ResponseBody
    public NodeUsageinfo getNodeUsage(
    ) {

        logger.error("-------- getNodeUsage --------");

        return edgeService.getNodeUsage();
    }
}
