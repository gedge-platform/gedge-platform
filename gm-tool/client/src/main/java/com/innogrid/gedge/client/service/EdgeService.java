package com.innogrid.gedge.client.service;

import com.innogrid.gedge.core.model.UserInfo;
import com.innogrid.gedge.coreedge.model.*;
import org.openstack4j.model.compute.InterfaceAttachment;
import org.openstack4j.model.compute.ext.Hypervisor;
import org.openstack4j.model.compute.ext.HypervisorStatistics;

import java.util.List;
import java.util.Map;

/**
 * @author wss
 * @date 2019.3.19
 * @brief 오픈스택 API 호출 서비스
 */
public interface EdgeService {

    /**
     * @author wss
     * @date 2019.3.19
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 서버 조회
     */
    List<ServerInfo> getServers(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @param info 오픈스택 서버 변경 파라미터
     * @param command 변경 하려는 정보에 대한 명령 (ex, 스팩 변경, 이름 등등)
     * @author wss
     * @date 2019.3.19
     * @brief 서버 수정
     */
    void updateServer(String cloudId, ServerInfo info, String command, UserInfo reqInfo, String token);

    /**
     * @param id 서버 ID
     * @return ServerInfo 조회된 단일 서버 정보
     * @author wss
     * @date 2019.3.19
     * @brief 단일 서버 조회
     */
    ServerInfo getServer(String cloudId, String id, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.3.19
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Image 조회
     */
    List<ImageInfo> getImages(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.3.25
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 KeyPair 조회
     */
    List<KeyPairInfo> getKeyPairs(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.3.19
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Flavor 조회
     */
    List<FlavorInfo> getFlavors(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.3.22
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Volume 조회
     */
    List<VolumeInfo> getVolumes(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.12
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Backup 조회
     */
    List<VolumeBackupInfo> getBackups(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.12
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Snapshot 조회
     */
    List<VolumeSnapshotInfo> getSnapshots(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.3.25
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Network 조회
     */
    List<NetworkInfo> getNetworks(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.3.25
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Router 조회
     */
    List<RouterInfo> getRouters(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.15
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 SecurityGroup 조회
     */
    List<SecurityGroupInfo> getSecurityGroups(String cloudId, Map<String, Object> params, Boolean project, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.15
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 FloatingIp 조회
     */
    List<FloatingIpInfo> getFloatingIps(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.16
     * @param cloudId 요청하는 cloud 정보
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 zone list 조회
     */
    List<AvailabilityZoneInfo> getZones(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.01
     * @param params 오픈스택 목록 정보 조회에 대한 파라미터
     * @brief 오픈스택 Project 조회
     */
    List<ProjectInfo> getProjects(String cloudId, Map<String, Object> params, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.10
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param action Server에 대한 Action
     * @Return server info
     * @brief 오픈스택 Server action
     */
    ServerInfo action(String cloudId, String id, String action, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.15
     * @param cloudId 요청하는 cloud 정보
     * @param createDate Server 생성 Data
     * @Return server info
     * @brief 오픈스택 Server Create
     */
    ServerInfo createServer(String cloudId, Map<String, Object> createDate, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.10
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param snapshotName Snapshot Name
     * @Return server info
     * @brief 오픈스택 Server Snapshot Create
     */
    String createServerSnapshot(String cloudId, String id, String snapshotName, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.11
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @Return vnc url
     * @brief 오픈스택 Server VNC URL
     */
    String getServerVNCConsoleURL(String cloudId, String id, UserInfo reqInfo, String token);

    /**
     * @author hso
     * @date 2019.4.30
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param params 메트릭 조건
     * @Return vnc url
     * @brief 오픈스택 Server VNC URL
     */
    Object getServerMetric(String cloudId, String id, UserInfo reqInfo, Map<String, Object> params, String token);

    /**
     * @author wss
     * @date 2019.4.11
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param line line 수
     * @Return vnc url
     * @brief 오픈스택 Server console output
     */
    String getServerConsoleOutput(String cloudId, String id, int line, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.11
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @Return action log list
     * @brief 오픈스택 Server console output
     */
    List<ActionLogInfo> getServerActionLog(String cloudId, String id, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.11
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @Return volume list
     * @brief 오픈스택 Server Volume 정보
     */
    List<VolumeInfo> getServerVolumes(String cloudId, String id, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.18
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param volumeId volume ID
     * @Return Volume info
     * @brief 오픈스택 Server volume attach
     */
    VolumeInfo attachVolume(String cloudId, String id, String volumeId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.18
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param volumeId volume ID
     * @Return Volume info
     * @brief 오픈스택 Server volume detach
     */
    VolumeInfo detachVolume(String cloudId, String id, String volumeId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.19
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param networkId network ID
     * @Return Boolean 성공 여부
     * @brief 오픈스택 Server interface attach
     */
    Boolean attachInterface(String cloudId, String id, String networkId, String projectId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.19
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @param portId port ID
     * @Return Boolean 성공 여부
     * @brief 오픈스택 Server interface detach
     */
    Boolean detachInterface(String cloudId, String id, String portId, String projectId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.19
     * @param cloudId 요청하는 cloud 정보
     * @param id Server ID
     * @Return Server interface list
     * @brief 오픈스택 Server interface list
     */
    List<? extends InterfaceAttachment> getServerInterface(String cloudId, String id, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @param serverId Server ID
     * @param projectId Server project Id
     * @param interfaceIp interfaceIp
     * @param floatingIp floatingIp
     * @param reqInfo 요청 유저 정보
     * @Return 성공 여부
     * @brief 오픈스택 Server 에 FloatingIp 추가
     */
    Boolean addFloatingIpToServer(String cloudId, String serverId, String interfaceIp, String floatingIp, String projectId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @param serverId Server ID
     * @param projectId Server project Id
     * @param floatingIp floatingIp
     * @param reqInfo 요청 유저 정보
     * @Return 성공 여부
     * @brief 오픈스택 Server 에 FloatingIp 제거
     */
    Boolean removeFloatingIpToServer(String cloudId, String serverId, String floatingIp, String projectId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @param poolName 풀 이름
     * @param reqInfo 요청 유저 정보
     * @Return FloatingIpInfo info
     * @brief 오픈스택 Pool 에 FloatingIp 추가
     */
    FloatingIpInfo allocateFloatingIp(String cloudId, String poolName, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @param floatingIpId FloatingIp ID
     * @param reqInfo 요청 유저 정보
     * @Return 성공 여부
     * @brief 오픈스택 Pool 에 FloatingIp 제거
     */
    Boolean deallocateFloatingIp(String cloudId, String floatingIpId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @param reqInfo 요청 유저 정보
     * @Return Pool 리스트
     * @brief 오픈스택 Pool 리스트 조회
     */
    List<String> getFloatingIpPoolNames(String cloudId, UserInfo reqInfo, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @Return Hypervisor 리스트
     * @brief 오픈스택 Hypervisor 리스트 조회
     */
    List<? extends Hypervisor> getHypervisors(String cloudId, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @Return HypervisorStatistics
     * @brief 오픈스택 HypervisorStatistics 조회
     */
    HypervisorStatistics getHypervisorStatistics(String cloudId, String token);

    /**
     * @author wss
     * @date 2019.4.22
     * @param cloudId 요청하는 cloud 정보
     * @Return ResourceInfo
     * @brief 오픈스택 리소스 사용량 조회
     */
    ResourceInfo getResourceUsage(String cloudId, String token);

    public Nodeinfo getMasterNode();

    public Nodeinfo getTotalNode();

    public List<EdgesInfo> getEdge();

    List<ItemsInfo> getNodes();

    ItemsInfo getNode(String machineId);

    public PodInfo getPods();

    public NodeUsageinfo getNodeUsage();

    List<NodeUsageItemInfo> getNodesUsage();
    List<PodItemsInfo> getPodInfos();
    PodItemsInfo getPodInfo(String uid);
}
