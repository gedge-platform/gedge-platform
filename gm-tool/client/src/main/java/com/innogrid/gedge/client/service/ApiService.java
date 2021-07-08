package com.innogrid.gedge.client.service;

import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.core.model.MeterServerAccumulateInfo;
import com.innogrid.gedge.core.model.MeterServerInfo;
import com.innogrid.gedge.core.model.ProjectInfo;

import java.util.List;

/**
 * @author wss
 * @date 2019.7.05
 * @brief Credential 관련 API 서비스
 */
public interface ApiService {

    List<CredentialInfo> getCredentialsProject(List<CredentialInfo> list, String token);

    boolean validateCredential(CredentialInfo info, String token);

    List<ProjectInfo> getGroupProject(List<ProjectInfo> list, String token);

    List<MeterServerInfo> getMeterServers(String cloudId, String serverId, String token);

    List<MeterServerAccumulateInfo> getMeterServerAccumulates(String cloudId, String token);
}
