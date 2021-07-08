package com.innogrid.gedge.client.service.impl;

import com.innogrid.gedge.client.service.EdgeService;
import com.innogrid.gedge.client.util.CommonUtil;
import com.innogrid.gedge.core.Constants;
import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.core.model.UserInfo;
import com.innogrid.gedge.core.util.AES256Util;
import com.innogrid.gedge.core.util.ObjectSerializer;
import com.innogrid.gedge.coredb.dao.ProjectDao;
import com.innogrid.gedge.coredb.service.ActionService;
import com.innogrid.gedge.coredb.service.CredentialService;
import com.innogrid.gedge.coreedge.model.*;
import fi.evident.dalesbred.Transactional;
import org.openstack4j.model.compute.InterfaceAttachment;
import org.openstack4j.model.compute.ext.Hypervisor;
import org.openstack4j.model.compute.ext.HypervisorStatistics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

/**
 * @author wss
 * @date 2019.3.19
 * @brief
 */
@Service
@Transactional
public class EdgeServiceImpl implements EdgeService {
    private final static Logger logger = LoggerFactory.getLogger(EdgeServiceImpl.class);
    private final static String PATH = "";
    public final static String API_PATH = "/openstack";

    @Autowired
    private ProjectDao projectDao;

    @Autowired(required = false)
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private CredentialService credentialService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${apigateway.url}")
    private String apiUrl;

    @Autowired
    private ActionService actionService;
    
    @Autowired
    private AES256Util aes256Util;

    private com.innogrid.gedge.core.model.ProjectInfo getProjectByGroupId(String cloudId, String groupId) {
        logger.info("[{}] Get Project By GroupId", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo info = projectDao.getProjectInfo(new HashMap<String, Object>(){{
            put("groupId", groupId);
            put("type", "openstack");
            put("cloudId", cloudId);
        }});

        logger.info("[{}] Get Project By GroupId Complete", CommonUtil.getUserUUID());
        return info;
    }

    private void sendMessage(String action, String reqUser, Object data) {
        CommonUtil.sendMessage(simpMessagingTemplate, PATH, action, reqUser, data);
    }

    @Override
    public List<ServerInfo> getServers(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Servers", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<ServerInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<ServerInfo>>(){}).getBody();

        logger.info("[{}] Get Servers Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();
        return lists;
    }

    @Override
    public void updateServer(String cloudId, ServerInfo info, String command, UserInfo reqInfo, String token) {

    }

    @Override
    public ServerInfo getServer(String cloudId, String id, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Server : '{}'", CommonUtil.getUserUUID(), id);
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ServerInfo info = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();


        logger.info("[{}] Get Server Complete : '{}", CommonUtil.getUserUUID(), info.getId());
        if(info == null) info = new ServerInfo();

        return info;
    }

    @Override
    public List<ImageInfo> getImages(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Images", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/images");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        if(params.get("active") != null) {
            url.queryParam("active", params.get("active"));
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<ImageInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<ImageInfo>>(){}).getBody();

        logger.info("[{}] Get Images Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<KeyPairInfo> getKeyPairs(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get KeyPairs", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/keypairs");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<KeyPairInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<KeyPairInfo>>(){}).getBody();

        logger.info("[{}] Get KeyPairs Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<FlavorInfo> getFlavors(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Flavors", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/flavors");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<FlavorInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<FlavorInfo>>(){}).getBody();

        logger.info("[{}] Get Flavors Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<VolumeInfo> getVolumes(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Volumes", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/volumes");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }
        if(params.get("bootable") != null) {
            url.queryParam("bootable", params.get("bootable"));
        }
        if(params.get("available") != null) {
            url.queryParam("available", params.get("available"));
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<VolumeInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<VolumeInfo>>(){}).getBody();

        logger.info("[{}] Get Volumes Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<VolumeBackupInfo> getBackups(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Volume Backups", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/backups");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<VolumeBackupInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<VolumeBackupInfo>>(){}).getBody();

        logger.info("[{}] Get Volume Backups Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<VolumeSnapshotInfo> getSnapshots(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Volume Snapshots", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/snapshots");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<VolumeSnapshotInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<VolumeSnapshotInfo>>(){}).getBody();

        logger.info("[{}] Get Volume Snapshots Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<NetworkInfo> getNetworks(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Networks", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/networks");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        if(projectInfo == null && params.get("project") != null && ((Boolean) params.get("project")) == Boolean.TRUE) {
            url.queryParam("project", credentialInfo.getProjectId());
        }

        List<NetworkInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<NetworkInfo>>(){}).getBody();

        logger.info("[{}] Get Networks Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<RouterInfo> getRouters(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Routers", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/routers");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<RouterInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<RouterInfo>>(){}).getBody();

        logger.info("[{}] Get Routers Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<SecurityGroupInfo> getSecurityGroups(String cloudId, Map<String, Object> params, Boolean project, UserInfo reqInfo, String token) {
        logger.info("[{}] Get SecurityGroups", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/securitygroups");

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        } else if(project) {
            url.queryParam("project", credentialInfo.getProjectId());
        }


        List<SecurityGroupInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<SecurityGroupInfo>>(){}).getBody();

        logger.info("[{}] Get SecurityGroups Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<FloatingIpInfo> getFloatingIps(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get FloatingIps", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/floatingips");

        if(params.get("projectId") != null) {
            url.queryParam("project", (String) params.get("projectId"));
        } else if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        if(params.get("down") != null) {
            url.queryParam("down", (Boolean) params.get("down"));
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<FloatingIpInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<FloatingIpInfo>>(){}).getBody();

        logger.info("[{}] Get FloatingIps Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<AvailabilityZoneInfo> getZones(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Availability Zone", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/zones");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }
        if(params.get("type") != null) {
            url.queryParam("type", (String)params.get("type"));
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<AvailabilityZoneInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<AvailabilityZoneInfo>>(){}).getBody();

        logger.info("[{}] Get Availability Zone Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<ProjectInfo> getProjects(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Projects", CommonUtil.getUserUUID());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/projects");

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<ProjectInfo> lists = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<ProjectInfo>>(){}).getBody();

        logger.info("[{}] Get Projects Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public ServerInfo action(String cloudId, String serverId, String action, UserInfo reqInfo, String token) {
        logger.info("[{}] Execute Action to Server : '{}'", CommonUtil.getUserUUID(), action);
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
        url1.path(API_PATH + "/servers/{id}");
        if(projectInfo != null) {
            url1.queryParam("project", projectInfo.getProjectId());
        }
        URI url = url1.buildAndExpand(serverId).toUri();

        ServerInfo server = null;

        Runnable function = null;

        switch (action) {
            case "START":
                UriComponentsBuilder url2 = UriComponentsBuilder.fromUriString(apiUrl);
                url2.path(API_PATH + "/servers/{id}/start");
                if(projectInfo != null) {
                    url2.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url2.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId1 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_START, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId1, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("active") || info.getState().equals("error")) {
                            if(info.getState().equals("active")) {
                                actionService.setActionResult(actionId1, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId1, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "REBOOT_SOFT":
                UriComponentsBuilder url3 = UriComponentsBuilder.fromUriString(apiUrl);
                url3.path(API_PATH + "/servers/{id}/reboot");
                if(projectInfo != null) {
                    url3.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url3.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId2 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_REBOOT_SOFT, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId2, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("active") || info.getState().equals("error")) {
                            if(info.getState().equals("active")) {
                                actionService.setActionResult(actionId2, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId2, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "REBOOT_HARD":
                UriComponentsBuilder url4 = UriComponentsBuilder.fromUriString(apiUrl);
                url4.path(API_PATH + "/servers/{id}/reboot");
                if(projectInfo != null) {
                    url4.queryParam("project", projectInfo.getProjectId());
                }
                url4.queryParam("hard", true);
                server = restTemplate.exchange(url4.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId3 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_REBOOT_HARD, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId3, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("active") || info.getState().equals("error")) {
                            if(info.getState().equals("active")) {
                                actionService.setActionResult(actionId3, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId3, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "UNPAUSE":
                UriComponentsBuilder url5 = UriComponentsBuilder.fromUriString(apiUrl);
                url5.path(API_PATH + "/servers/{id}/unpause");
                if(projectInfo != null) {
                    url5.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url5.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId4 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_UNPAUSE, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId4, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("active") || info.getState().equals("error")) {
                            if(info.getState().equals("active")) {
                                actionService.setActionResult(actionId4, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId4, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "RESUME":
                UriComponentsBuilder url6 = UriComponentsBuilder.fromUriString(apiUrl);
                url6.path(API_PATH + "/servers/{id}/resume");
                if(projectInfo != null) {
                    url6.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url6.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId5 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_RESUME, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId5, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("active") || info.getState().equals("error")) {
                            if(info.getState().equals("active")) {
                                actionService.setActionResult(actionId5, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId5, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "STOP":
                UriComponentsBuilder url7 = UriComponentsBuilder.fromUriString(apiUrl);
                url7.path(API_PATH + "/servers/{id}/stop");
                if(projectInfo != null) {
                    url7.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url7.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId6 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_SHUTDOWN, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId6, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("shutoff") || info.getState().equals("error")) {
                            if(info.getState().equals("shutoff")) {
                                actionService.setActionResult(actionId6, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId6, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "PAUSE":
                UriComponentsBuilder url8 = UriComponentsBuilder.fromUriString(apiUrl);
                url8.path(API_PATH + "/servers/{id}/pause");
                if(projectInfo != null) {
                    url8.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url8.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId7 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_PAUSE, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId7, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("paused") || info.getState().equals("error")) {
                            if(info.getState().equals("paused")) {
                                actionService.setActionResult(actionId7, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId7, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }
                        duration += 1;
                    }
                };
                break;
            case "SUSPEND":
                UriComponentsBuilder url9 = UriComponentsBuilder.fromUriString(apiUrl);
                url9.path(API_PATH + "/servers/{id}/suspend");
                if(projectInfo != null) {
                    url9.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url9.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId8 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                        server.getName(), Constants.ACTION_CODE.SERVER_SUSPEND, Constants.HISTORY_TYPE.OPENSTACK);

                function = () -> {

                    int duration = 0;
                    ServerInfo info = null;

                    actionService.setActionResult(actionId8, Constants.ACTION_RESULT.PROGRESSING);

                    while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                        CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                        info = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                        sendMessage(action, reqInfo.getId(), info);

                        if (info == null || info.getState().equals("suspended") || info.getState().equals("error")) {
                            if(info.getState().equals("suspended")) {
                                actionService.setActionResult(actionId8, Constants.ACTION_RESULT.SUCCESS);
                            } else {
                                actionService.setActionResult(actionId8, Constants.ACTION_RESULT.FAILED);
                            }
                            break;
                        }

                        duration += 1;
                    }
                };
                break;
            case "DELETE":
                UriComponentsBuilder url10 = UriComponentsBuilder.fromUriString(apiUrl);
                url10.path(API_PATH + "/servers/{id}/delete");
                if(projectInfo != null) {
                    url10.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url10.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId9 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_DELETE, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId9, Constants.ACTION_RESULT.SUCCESS);

                break;
            case "LOCK":
                UriComponentsBuilder url11 = UriComponentsBuilder.fromUriString(apiUrl);
                url11.path(API_PATH + "/servers/{id}/lock");
                if(projectInfo != null) {
                    url11.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url11.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId10 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_LOCK, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId10, Constants.ACTION_RESULT.SUCCESS);
                break;
            case "UNLOCK":
                UriComponentsBuilder url12 = UriComponentsBuilder.fromUriString(apiUrl);
                url12.path(API_PATH + "/servers/{id}/unlock");
                if(projectInfo != null) {
                    url12.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url12.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId11 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_UNLOCK, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId11, Constants.ACTION_RESULT.SUCCESS);
                break;
            case "RESCUE":
                UriComponentsBuilder url13 = UriComponentsBuilder.fromUriString(apiUrl);
                url13.path(API_PATH + "/servers/{id}/rescue");
                if(projectInfo != null) {
                    url13.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url13.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId12 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_RESCUE, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId12, Constants.ACTION_RESULT.SUCCESS);
                break;
            case "UNRESCUE":
                UriComponentsBuilder url14 = UriComponentsBuilder.fromUriString(apiUrl);
                url14.path(API_PATH + "/servers/{id}/unrescue");
                if(projectInfo != null) {
                    url14.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url14.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId13 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_UNRESCUE, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId13, Constants.ACTION_RESULT.SUCCESS);
                break;
            case "SHELVE":
                UriComponentsBuilder url15 = UriComponentsBuilder.fromUriString(apiUrl);
                url15.path(API_PATH + "/servers/{id}/shelve");
                if(projectInfo != null) {
                    url15.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url15.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId14 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_SHELVE, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId14, Constants.ACTION_RESULT.SUCCESS);
                break;
            case "SHELVE_OFFLOAD":
                UriComponentsBuilder url16 = UriComponentsBuilder.fromUriString(apiUrl);
                url16.path(API_PATH + "/servers/{id}/shelveoffload");
                if(projectInfo != null) {
                    url16.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url16.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId15 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_SHELVE_OFFLOAD, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId15, Constants.ACTION_RESULT.SUCCESS);
                break;
            case "UNSHELVE":
                UriComponentsBuilder url17 = UriComponentsBuilder.fromUriString(apiUrl);
                url17.path(API_PATH + "/servers/{id}/unshelve");
                if(projectInfo != null) {
                    url17.queryParam("project", projectInfo.getProjectId());
                }
                server = restTemplate.exchange(url17.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                String actionId16 = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), serverId,
                        server.getName(), Constants.ACTION_CODE.SERVER_UNSHELVE, Constants.HISTORY_TYPE.OPENSTACK);

                actionService.setActionResult(actionId16, Constants.ACTION_RESULT.SUCCESS);
                break;
        }

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Execute Action to Server Complete : '{}'", CommonUtil.getUserUUID(), action);
        return server;
    }



    @Override
    public ServerInfo createServer(String cloudId, Map<String, Object> createData, UserInfo reqInfo, String token) {
        logger.info("[{}] Create Server", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers");

        UriComponentsBuilder url2 = UriComponentsBuilder.fromUriString(apiUrl);
        url2.path(API_PATH + "/servers/{id}");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
            url2.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ServerInfo server = restTemplate.exchange(url.build().toUri(), HttpMethod.POST, new HttpEntity(createData, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                server.getName(), Constants.ACTION_CODE.SERVER_CREATE, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            ServerInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

//                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));
                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (CommonUtil.MAX_RETRY_COUNT - duration));

                info = restTemplate.exchange(url2.buildAndExpand(server.getId()).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                sendMessage("SERVER_CREATE", reqInfo.getId(), info);

                if (info == null || info.getState().equals("active") || info.getState().equals("error")) {
                    if(info.getState().equals("active")) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Create Server Complete : '{}'", CommonUtil.getUserUUID(), server.getId());
        return server;
    }

    @Override
    public String createServerSnapshot(String cloudId, String id, String snapshotName, UserInfo reqInfo, String token) {
        logger.info("[{}] Create Server Snapshot", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/snapshot");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        String snapshotId = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{put("name", snapshotName);}}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Map<String, String>>(){}).getBody().get("imageId");

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), snapshotId, snapshotId,
                snapshotName, Constants.ACTION_CODE.SNAPSHOT_CREATE, Constants.HISTORY_TYPE.OPENSTACK);

        if(snapshotId != null) {
            actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
        } else {
            actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
        }

        logger.info("[{}] Create Server Snapshot Complete", CommonUtil.getUserUUID());

        return snapshotId;
    }

    @Override
    public String getServerVNCConsoleURL(String cloudId, String id, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Server VNCConsole URL", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/console");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        String consoleUrl = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Map<String, String>>(){}).getBody().get("url");

        logger.info("[{}] Get Server VNCConsole URL Complete", CommonUtil.getUserUUID());
        return consoleUrl;
    }

    @Override
    public Object getServerMetric(String cloudId, String id, UserInfo reqInfo, Map<String, Object> params, String token) {
        logger.info("[{}] Get Server Metric", CommonUtil.getUserUUID());
//        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/metric");

        for (Map.Entry<String, Object> entry : params.entrySet()) {
            url.queryParam(entry.getKey(), entry.getValue());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        Object serverMetric = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Map<String, Object>>(){}).getBody();
        logger.info("[{}] Get Server Metric Complete", CommonUtil.getUserUUID());
        return serverMetric;
    }

    @Override
    public String getServerConsoleOutput(String cloudId, String id, int line, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Server Console Output", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/log");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        url.queryParam("line", line);

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        String consoleOutput = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Map<String, String>>(){}).getBody().get("log");

        logger.info("[{}] Get Server Console Output Complete", CommonUtil.getUserUUID());
        return consoleOutput;
    }

    @Override
    public List<ActionLogInfo> getServerActionLog(String cloudId, String id, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Server Action Log", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/action");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<ActionLogInfo> lists = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<ActionLogInfo>>(){}).getBody();

        logger.info("[{}] Get Server Action Log Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public List<VolumeInfo> getServerVolumes(String cloudId, String id, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Server Volumes", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/volumes");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<VolumeInfo> lists = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<VolumeInfo>>(){}).getBody();

        logger.info("[{}] Get Server Volumes Complete", CommonUtil.getUserUUID());
        if(lists == null) lists = new ArrayList<>();

        return lists;
    }

    @Override
    public VolumeInfo attachVolume(String cloudId, String id, String volumeId, UserInfo reqInfo, String token) {
        logger.info("[{}] Attach Volume", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/volumes/{volumeId}");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        VolumeInfo volume = restTemplate.exchange(url.buildAndExpand(id, volumeId).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{put("action", "ATTACH_VOLUME");}}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<VolumeInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), volume.toString(), volume.getId(),
                volume.getName(), Constants.ACTION_CODE.VOLUME_ATTACH, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            VolumeInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
                url1.path(API_PATH + "/volumes/{volumeId}");

                if(projectInfo != null) {
                    url1.queryParam("project", projectInfo.getProjectId());
                }

                info = restTemplate.exchange(url1.buildAndExpand(volumeId).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<VolumeInfo>(){}).getBody();

                sendMessage("ATTACH_VOLUME", reqInfo.getId(), info);

                if (info == null || (info.getState().equals("in-use") && info.getAttachmentInfos().size() > 0) || info.getState().equals("available")) {
                    if((info.getState().equals("in-use") && info.getAttachmentInfos().size() > 0)) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Attach Volume Complete", CommonUtil.getUserUUID());
        return volume;
    }

    @Override
    public VolumeInfo detachVolume(String cloudId, String id, String volumeId, UserInfo reqInfo, String token) {
        logger.info("[{}] Detach Volume", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/volumes/{volumeId}");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        VolumeInfo volume = restTemplate.exchange(url.buildAndExpand(id, volumeId).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{put("action", "DETACH_VOLUME");}}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<VolumeInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), volume.toString(), volume.getId(),
                volume.getName(), Constants.ACTION_CODE.VOLUME_DETACH, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            VolumeInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
                url1.path(API_PATH + "/volumes/{volumeId}");

                if(projectInfo != null) {
                    url1.queryParam("project", projectInfo.getProjectId());
                }

                info = restTemplate.exchange(url1.buildAndExpand(volumeId).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<VolumeInfo>(){}).getBody();


                sendMessage("DETACH_VOLUME", reqInfo.getId(), info);

                if (info == null || info.getState().equals("available") || (info.getState().equals("in-use") && info.getAttachmentInfos().size() > 0)) {
                    if(info.getState().equals("available")) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Detach Volume Complete", CommonUtil.getUserUUID());
        return volume;
    }

    @Override
    public Boolean attachInterface(String cloudId, String id, String networkId, String projectId, UserInfo reqInfo, String token) {
        logger.info("[{}] Attach Interface", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/interface");

        if(projectId != null) {
            url.queryParam("project", projectId);
        } else if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ServerInfo server = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{
            put("action", "ATTACH_INTERFACE");
            put("networkId", networkId);
        }}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                server.getName(), Constants.ACTION_CODE.INTERFACE_ATTACH, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            ServerInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
                url1.path(API_PATH + "/servers/{id}");

                if(projectInfo != null) {
                    url1.queryParam("project", projectInfo.getProjectId());
                }

                info = restTemplate.exchange(url1.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                sendMessage("ATTACH_INTERFACE", reqInfo.getId(), info);

                if (info == null || server.getAddresses().size() < info.getAddresses().size()) {
                    if(server.getAddresses().size() < info.getAddresses().size()) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Attach Interface Complete", CommonUtil.getUserUUID());
        return server != null;
    }

    @Override
    public Boolean detachInterface(String cloudId, String id, String portId, String projectId, UserInfo reqInfo, String token) {
        logger.info("[{}] Detach Interface", CommonUtil.getUserUUID());

        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/interface");

        if(projectId != null) {
            url.queryParam("project", projectId);
        } else if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ServerInfo server = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{
            put("action", "DETACH_INTERFACE");
            put("portId", portId);
        }}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                server.getName(), Constants.ACTION_CODE.INTERFACE_DETACH, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            ServerInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
                url1.path(API_PATH + "/servers/{id}");

                if(projectInfo != null) {
                    url1.queryParam("project", projectInfo.getProjectId());
                }

                info = restTemplate.exchange(url1.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                sendMessage("DETACH_INTERFACE", reqInfo.getId(), info);

                if (info == null || server.getAddresses().size() > info.getAddresses().size()) {
                    if(server.getAddresses().size() > info.getAddresses().size()) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Detach Interface Complete", CommonUtil.getUserUUID());
        return server != null;
    }

    @Override
    public List<? extends InterfaceAttachment> getServerInterface(String cloudId, String id, UserInfo reqInfo, String token) {
        logger.info("[{}] Get Server Interface", CommonUtil.getUserUUID());

        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/interface");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<? extends InterfaceAttachment> list = restTemplate.exchange(url.buildAndExpand(id).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<? extends InterfaceAttachment>>(){}).getBody();

        logger.info("[{}] Get Server Interface Complete", CommonUtil.getUserUUID());
        if(list == null) return new ArrayList<>();
        return list;
    }

    @Override
    public Boolean addFloatingIpToServer(String cloudId, String serverId, String interfaceIp, String floatingIp, String projectId, UserInfo reqInfo, String token) {
        logger.info("[{}] Add FloatingIp To Server", CommonUtil.getUserUUID());

        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/floatingip");

        if(projectId != null) {
            url.queryParam("project", projectId);
        } else if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ServerInfo server = restTemplate.exchange(url.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{
            put("interfaceIp", interfaceIp);
            put("floatingIp", floatingIp);
            put("action", "CONNECT_FLOATING_IP");
        }}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                server.getName(), Constants.ACTION_CODE.FLOATING_IP_ADD, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            ServerInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
                url1.path(API_PATH + "/servers/{id}");

                if(projectInfo != null) {
                    url1.queryParam("project", projectInfo.getProjectId());
                }

                info = restTemplate.exchange(url1.buildAndExpand(serverId).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                sendMessage("CONNECT_FLOATING_IP", reqInfo.getId(), info);

                if (info == null || server.getAddresses().size() < info.getAddresses().size()) {
                    if(server.getAddresses().size() < info.getAddresses().size()) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Add FloatingIp To Server Complete", CommonUtil.getUserUUID());
        return server != null;
    }

    @Override
    public Boolean removeFloatingIpToServer(String cloudId, String serverId, String floatingIp, String projectId, UserInfo reqInfo, String token) {
        logger.info("[{}] Remove FloatingIp To Server", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/servers/{id}/floatingip");

        if(projectId != null) {
            url.queryParam("project", projectId);
        } else if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ServerInfo server = restTemplate.exchange(url.buildAndExpand(serverId).toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{
            put("floatingIp", floatingIp);
            put("action", "DISCONNECT_FLOATING_IP");
        }}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

        String actionId = actionService.initAction(reqInfo.getGroupId(), reqInfo.getId(), server.toString(), server.getId(),
                server.getName(), Constants.ACTION_CODE.FLOATING_IP_REMOVE, Constants.HISTORY_TYPE.OPENSTACK);

        Runnable function = () -> {

            int duration = 0;
            ServerInfo info = null;

            actionService.setActionResult(actionId, Constants.ACTION_RESULT.PROGRESSING);

            while ( duration < CommonUtil.MAX_RETRY_COUNT ) {

                CommonUtil.sleep(CommonUtil.SLEEP_TIME * (duration + 1));

                UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
                url1.path(API_PATH + "/servers/{id}");

                if(projectInfo != null) {
                    url1.queryParam("project", projectInfo.getProjectId());
                }

                info = restTemplate.exchange(url1.buildAndExpand(serverId).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ServerInfo>(){}).getBody();

                sendMessage("DISCONNECT_FLOATING_IP", reqInfo.getId(), info);

                if (info == null || server.getAddresses().size() > info.getAddresses().size()) {
                    if(server.getAddresses().size() > info.getAddresses().size()) {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.SUCCESS);
                    } else {
                        actionService.setActionResult(actionId, Constants.ACTION_RESULT.FAILED);
                    }
                    break;
                }

                duration += 1;
            }
        };

        if(function != null) {
            new Thread(function).start();
        }

        logger.info("[{}] Remove FloatingIp To Server Complete", CommonUtil.getUserUUID());
        return server != null;
    }

    @Override
    public FloatingIpInfo allocateFloatingIp(String cloudId, String poolName, UserInfo reqInfo, String token) {
        logger.info("[{}] Allocate FloatingIp To Server", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path("/floatingip");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        FloatingIpInfo info = restTemplate.exchange(url.build().toUri(), HttpMethod.POST, new HttpEntity(new HashMap<String, String>(){{
            put("poolName", poolName);
        }}, CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<FloatingIpInfo>(){}).getBody();

        logger.info("[{}] Allocate FloatingIp To Server Complete", CommonUtil.getUserUUID());
        return info;
    }

    @Override
    public Boolean deallocateFloatingIp(String cloudId, String floatingIpId, UserInfo reqInfo, String token) {
        logger.info("[{}] Deallocate FloatingIp To Server", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path("/floatingip/{floatingIpId}");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        HttpStatus statusCode = restTemplate.exchange(url.buildAndExpand(floatingIpId).toUri(), HttpMethod.DELETE, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Void>(){}).getStatusCode();

        logger.info("[{}] Deallocate FloatingIp To Server Complete", CommonUtil.getUserUUID());
        return statusCode == HttpStatus.OK || statusCode == HttpStatus.NO_CONTENT;
    }

    @Override
    public List<String> getFloatingIpPoolNames(String cloudId, UserInfo reqInfo, String token) {
        logger.info("[{}] Get FloatingIp Pool Names", CommonUtil.getUserUUID());
        com.innogrid.gedge.core.model.ProjectInfo projectInfo = getProjectByGroupId(cloudId, reqInfo.getGroupId());

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/floatingIpools");

        if(projectInfo != null) {
            url.queryParam("project", projectInfo.getProjectId());
        }

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<String> list = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<String>>(){}).getBody();

        logger.info("[{}] Get FloatingIp Pool Names Complete", CommonUtil.getUserUUID());
        return list;
    }

    @Override
    public List<? extends Hypervisor> getHypervisors(String cloudId, String token) {
        logger.info("[{}] Get Hypervisors", CommonUtil.getUserUUID());
        UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
        url1.path(API_PATH + "/hypervisors");

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        List<? extends Hypervisor> list = restTemplate.exchange(url1.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<? extends Hypervisor>>(){}).getBody();
        logger.info("[{}] Get Hypervisors Complete", CommonUtil.getUserUUID());
        return list;
    }

    @Override
    public HypervisorStatistics getHypervisorStatistics(String cloudId, String token) {
        logger.info("[{}] Get Hypervisor Statistics", CommonUtil.getUserUUID());
        UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
        url1.path(API_PATH + "/hypervisorstatistics");

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        HypervisorStatistics info = restTemplate.exchange(url1.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<HypervisorStatistics>(){}).getBody();
        logger.info("[{}] Get Hypervisor Statistics Complete", CommonUtil.getUserUUID());
        return info;
    }

    @Override
    public ResourceInfo getResourceUsage(String cloudId, String token) {
        logger.info("[{}] Get ResourceUsage", CommonUtil.getUserUUID());
        UriComponentsBuilder url1 = UriComponentsBuilder.fromUriString(apiUrl);
        url1.path(API_PATH + "/resource");

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);

        ResourceInfo info = restTemplate.exchange(url1.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<ResourceInfo>(){}).getBody();
        logger.info("[{}] Get ResourceUsage Complete", CommonUtil.getUserUUID());
        return info;
    }

    @Override
    public Nodeinfo getMasterNode() {

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/getmasternode");
        String token = null;
        String credentialInfo = null;

        Nodeinfo lists = restTemplate.exchange(url.build().encode().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Nodeinfo>(){}).getBody();
        return lists;
    }

    @Override
    public Nodeinfo getTotalNode() {

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/gettotalnode");
        String token = null;
        String credentialInfo = null;

        Nodeinfo lists = restTemplate.exchange(url.build().encode().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<Nodeinfo>(){}).getBody();
        return lists;
    }

    @Override
    public List<EdgesInfo> getEdge() {

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/getEdge");
        String token = null;
        String credentialInfo = null;

        List<EdgesInfo> lists = restTemplate.exchange(url.build().encode().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<EdgesInfo>>(){}).getBody();
        return lists;
    }


    @Override
    public List<ItemsInfo> getNodes() {
        Nodeinfo totalInfo = getTotalNode();
        Nodeinfo masterInfo = getMasterNode();
        List<ItemsInfo> itemsInfos = new ArrayList<>();
        List<PodItemsInfo> podItemsInfos = getPodInfos();
        List<NodeUsageItemInfo> nodeUsageItemInfos = getNodesUsage();

        for(ItemsInfo info1 : totalInfo.getItems()){
            for(ItemsInfo info2 : masterInfo.getItems()){
                if(info1.getStatus().getNodeInfo().getMachineID().equals(info2.getStatus().getNodeInfo().getMachineID())){
                    info1.getStatus().getNodeInfo().setRole("Master");
                    itemsInfos.add(info1);
                }else{
                    info1.getStatus().getNodeInfo().setRole("Worker");
                    itemsInfos.add(info1);
                }
            }
        }

        for(ItemsInfo itemsInfo : itemsInfos){
            int count = 0;
            for(PodItemsInfo podItemsInfo : podItemsInfos){
                if(podItemsInfo.getStatus().getHostIP().equals(itemsInfo.getStatus().getAddresses()[0].getAddress())){
                    count += 1;
                }
            }
            itemsInfo.getStatus().getAllocatable().setUsingPods(count);
        }

        for(ItemsInfo itemsInfo : itemsInfos){
            for(NodeUsageItemInfo nodeUsageItemInfo : nodeUsageItemInfos){
                if(itemsInfo.getMetadata().getName().equals(nodeUsageItemInfo.getMetadata().getName())){
                    itemsInfo.getStatus().getAllocatable().setUsingCpu(nodeUsageItemInfo.getUsage().getCpu());
                    itemsInfo.getStatus().getAllocatable().setUsingMemory(nodeUsageItemInfo.getUsage().getMemory());
                }
            }
        }

        return itemsInfos;
    }

    @Override
    public ItemsInfo getNode(String machineId) {
        List<ItemsInfo> itemsInfos = getNodes();
        for(ItemsInfo itemsInfo : itemsInfos){
            if(itemsInfo.getStatus().getNodeInfo().getMachineID().equals(machineId)){
                return itemsInfo;
            }
        }
        return null;
    }

    @Override
    public PodInfo getPods() {

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/getPods");
        String token = null;
        String credentialInfo = null;

        PodInfo lists = restTemplate.exchange(url.build().encode().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<PodInfo>(){}).getBody();
        return lists;
    }

    @Override
    public NodeUsageinfo getNodeUsage() {

        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiUrl);
        url.path(API_PATH + "/getNodeUsage");
        String token = null;
        String credentialInfo = null;

        NodeUsageinfo lists = restTemplate.exchange(url.build().encode().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<NodeUsageinfo>(){}).getBody();
        return lists;
    }

    @Override
    public List<NodeUsageItemInfo> getNodesUsage() {
        NodeUsageinfo nodeUsageinfo = getNodeUsage();
        return Arrays.asList(nodeUsageinfo.getItems());
    }

    @Override
    public List<PodItemsInfo> getPodInfos(){
        PodInfo podInfo = getPods();
        return Arrays.asList(podInfo.getItems());
    }

    @Override
    public PodItemsInfo getPodInfo(String uid){
        List<PodItemsInfo> podItemsInfos = getPodInfos();
        for(PodItemsInfo podItemsInfo : podItemsInfos){
            if(podItemsInfo.getMetadata().getUid().equals(uid)){
                return podItemsInfo;
            }
        }
        return null;
    }
}