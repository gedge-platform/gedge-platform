package com.innogrid.gedge.client.service.impl;

import com.innogrid.gedge.client.service.ApiService;
import com.innogrid.gedge.client.util.CommonUtil;
import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.core.model.MeterServerAccumulateInfo;
import com.innogrid.gedge.core.model.MeterServerInfo;
import com.innogrid.gedge.core.model.ProjectInfo;
import com.innogrid.gedge.core.util.AES256Util;
import com.innogrid.gedge.core.util.ObjectSerializer;
import com.innogrid.gedge.coredb.service.CredentialService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ApiServiceImpl implements ApiService {
    private final static Logger logger = LoggerFactory.getLogger(ApiServiceImpl.class);

    @Autowired
    private RestTemplate restTemplate;

//    @Value("${openstack.url}")
//    private String apiOpenstackUrl;
//
//    @Value("${aws.url}")
//    private String apiAwsUrl;
//
//    @Value("${azure.url}")
//    private String apiAzureUrl;
//
//    @Value("${vmware.url}")
//    private String apiVmwareUrl;

    @Value(("${apigateway.url}"))
    private String apiGatewayUrl;

    @Autowired
    private CredentialService credentialService;

    @Autowired
    private AES256Util aes256Util;

    @Override
    public List<CredentialInfo> getCredentialsProject(List<CredentialInfo> list, String token) {

        for(int i=0; i<list.size(); i++) {
            CredentialInfo info = list.get(i);
            List<ProjectInfo> projectInfos = new ArrayList<>();
            if(info.getType().equals("openstack")) {
                UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiGatewayUrl + EdgeServiceImpl.API_PATH);
                url.path("/projects");

                try {
                    List<com.innogrid.gedge.coreedge.model.ProjectInfo> openstackProjects = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(info)), token)), new ParameterizedTypeReference<List<com.innogrid.gedge.coreedge.model.ProjectInfo>>() {}).getBody();

                    for (int j = 0; j < openstackProjects.size(); j++) {
                        com.innogrid.gedge.coreedge.model.ProjectInfo openstackProject = openstackProjects.get(j);

                        ProjectInfo projectInfo = new ProjectInfo();
                        projectInfo.setProjectName(openstackProject.getName());
                        projectInfo.setProjectId(openstackProject.getId());
                        projectInfo.setDescription(openstackProject.getDescription());
                        projectInfo.setCloudId(info.getId());
                        projectInfo.setCloudName(info.getName());
                        projectInfo.setType(info.getType());

                        projectInfos.add(projectInfo);
                    }
                } catch (HttpServerErrorException e) {
                    logger.error("Failed to get CredentialsProject (Openstack): '{}'", e.getMessage());
                    continue;
                }

//            } else if(info.getType().equals("azure")) {
//                List<SubscriptionInfo> azureSubscriptions = azureApi.getSubscriptions(info.getId());
//
//                for (int j = 0; j < azureSubscriptions.size(); j++) {
//                    SubscriptionInfo subscriptionInfo = azureSubscriptions.get(j);
//
//                    ProjectInfo projectInfo = new ProjectInfo();
//                    projectInfo.setProjectName(subscriptionInfo.getDisplayName());
//                    projectInfo.setProjectId(subscriptionInfo.getSubscriptionId());
//                    projectInfo.setDescription(subscriptionInfo.getState());
//                    projectInfo.setCloudId(info.getId());
//                    projectInfo.setCloudName(info.getName());
//                    projectInfo.setType(info.getType());
//
//                    projectInfos.add(projectInfo);
//                }
//
            } else {
                ProjectInfo projectInfo = new ProjectInfo();
                projectInfo.setProjectName(info.getName());
                projectInfo.setProjectId(info.getId());
                projectInfo.setDescription("");
                projectInfo.setCloudId(info.getId());
                projectInfo.setCloudName(info.getName());
                projectInfo.setType(info.getType());

                projectInfos.add(projectInfo);
            }
            info.setProjects(projectInfos);

        }

        return list;
    }

    @Override
    public boolean validateCredential(CredentialInfo info, String token) {

        boolean isValid = true;

        // 클라우드 별 Credential 유효성 체크
        switch (info.getType()) {

            case "edge":
                UriComponentsBuilder url2 = UriComponentsBuilder.fromUriString(apiGatewayUrl + EdgeServiceImpl.API_PATH);
                url2.path("/validate");

                isValid = restTemplate.exchange(url2.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(info)), token)), new ParameterizedTypeReference<Map<String, Boolean>>(){}).getBody().get("result");
                break;

        }

        return isValid;
    }

    @Override
    public List<ProjectInfo> getGroupProject(List<ProjectInfo> list, String token) {

        for(int i=0; i<list.size(); i++) {
            ProjectInfo info = list.get(i);
            if(info.getType().equals("edge")) {
                UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiGatewayUrl + EdgeServiceImpl.API_PATH);
                url.path("/projects/{projectId}");

                CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(info.getCloudId());

                com.innogrid.gedge.coreedge.model.ProjectInfo openstackProject = restTemplate.exchange(url.buildAndExpand(info.getProjectId()).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<com.innogrid.gedge.coreedge.model.ProjectInfo>(){}).getBody();

                info.setProjectName(openstackProject.getName());
                info.setDescription(openstackProject.getDescription());
//            } else if(info.getType().equals("azure")) {
//                List<SubscriptionInfo> subscriptionInfos = azureApi.getSubscriptions(info.getCloudId());
//                if(subscriptionInfos.size() == 0) continue;
//
//                List<SubscriptionInfo> subscriptionInfoList = subscriptionInfos.stream().filter(sub -> sub.getSubscriptionId().equals(info.getProjectId())).collect(Collectors.toList());
//                if(subscriptionInfoList.size() > 0) {
//                    SubscriptionInfo subscriptionInfo = subscriptionInfoList.get(0);
//                    info.setProjectName(subscriptionInfo.getDisplayName());
//                }
            } else {
                info.setProjectName(info.getCloudName());
            }
        }

        return list;
    }

    @Override
    public List<MeterServerInfo> getMeterServers(String cloudId, String serverId, String token) {

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);
        List<MeterServerInfo> list = null;

        if(credentialInfo.getType().equals("edge")) {
            UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiGatewayUrl + EdgeServiceImpl.API_PATH);
            url.path("/meter/servers/{id}");

            list = restTemplate.exchange(url.buildAndExpand(serverId).toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<MeterServerInfo>>(){}).getBody();
        }

        if(list == null) return new ArrayList<>();

        return list;
    }

    @Override
    public List<MeterServerAccumulateInfo> getMeterServerAccumulates(String cloudId, String token) {

        CredentialInfo credentialInfo = credentialService.getCredentialsFromMemoryById(cloudId);
        List<MeterServerAccumulateInfo> list = null;

        if(credentialInfo.getType().equals("edge")) {
            UriComponentsBuilder url = UriComponentsBuilder.fromUriString(apiGatewayUrl + EdgeServiceImpl.API_PATH);
            url.path("/openstack/meter/servers");

            list = restTemplate.exchange(url.build().toUri(), HttpMethod.GET, new HttpEntity(CommonUtil.getAuthHeaders(aes256Util.encrypt(ObjectSerializer.serializedData(credentialInfo)), token)), new ParameterizedTypeReference<List<MeterServerAccumulateInfo>>(){}).getBody();
        }

        if(list == null) return new ArrayList<>();

        return list;
    }
}
