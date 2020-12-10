package com.innogrid.gedge.apiopenstack.service;

import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.coreedge.model.*;
import org.openstack4j.model.compute.InterfaceAttachment;
import org.openstack4j.model.compute.ext.Hypervisor;
import org.openstack4j.model.compute.ext.HypervisorStatistics;

import java.util.List;

public interface EdgeService {
    boolean validateCredential(CredentialInfo credentialInfo);

    List<ServerInfo> getServers(CredentialInfo credentialInfo, String projectId);

    ServerInfo getServer(CredentialInfo credentialInfo, String projectId, String serverId);

    List<ImageInfo> getImages(CredentialInfo credentialInfo, String projectId);

    List<ImageInfo> getImages(CredentialInfo credentialInfo, String projectId, Boolean active);

    List<KeyPairInfo> getKeyPairs(CredentialInfo credentialInfo, String projectId);

    List<FlavorInfo> getFlavors(CredentialInfo credentialInfo, String projectId);

    List<VolumeInfo> getVolumes(CredentialInfo credentialInfo, String projectId);

    List<VolumeInfo> getVolumes(CredentialInfo credentialInfo, String projectId, Boolean bootable, Boolean available);

    VolumeInfo getVolume(CredentialInfo credentialInfo, String projectId, String volumeId);

    List<VolumeBackupInfo> getBackups(CredentialInfo credentialInfo, String projectId);

    List<VolumeSnapshotInfo> getSnapshots(CredentialInfo credentialInfo, String projectId);

    List<NetworkInfo> getNetworks(CredentialInfo credentialInfo, String projectId);

    List<RouterInfo> getRouters(CredentialInfo credentialInfo, String projectId);

    List<SecurityGroupInfo> getSecurityGroups(CredentialInfo credentialInfo, String projectId);

    List<FloatingIpInfo> getFloatingIps(CredentialInfo credentialInfo, String projectId, Boolean down);

    List<AvailabilityZoneInfo> getZones(CredentialInfo credentialInfo, String projectId, String type);

    List<String> getFloatingIpPoolNames(CredentialInfo credentialInfo, String projectId);

    FloatingIpInfo allocateFloatingIp(CredentialInfo credentialInfo, String projectId, String poolName);

    Boolean deallocateFloatingIp(CredentialInfo credentialInfo, String projectId, String floatingIpId);

    Boolean addFloatingIpToServer(CredentialInfo credentialInfo, String projectId, String serverId, String interfaceIp, String floatingIp);

    Boolean removeFloatingIpToServer(CredentialInfo credentialInfo, String projectId, String serverId, String floatingIp);

    Boolean attachInterface(CredentialInfo credentialInfo, String projectId, String serverId, String networkId);

    Boolean detachInterface(CredentialInfo credentialInfo, String projectId, String serverId, String portId);

    List<? extends InterfaceAttachment> getServerInterface(CredentialInfo credentialInfo, String projectId, String serverId);

    List<ProjectInfo> getProjects(CredentialInfo credentialInfo);

    List<ProjectInfo> getProjectsInMemory(CredentialInfo credentialInfo);

    String getProjectName(CredentialInfo credentialInfo, String projectId);

    ProjectInfo getProject(CredentialInfo credentialInfo, String projectId);

    ServerInfo start(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo stop(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo rebootSoft(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo rebootHard(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo delete(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo pause(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo unpause(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo lock(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo unlock(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo suspend(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo resume(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo rescue(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo unrescue(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo shelve(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo shelveOffload(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo unshelve(CredentialInfo credentialInfo, String projectId, String serverId);

    ServerInfo createServer(CredentialInfo credentialInfo, String projectId, CreateServerInfo createServerInfo);

    String createServerSnapshot(CredentialInfo credentialInfo, String projectId, String serverId, String snapshotName);

    Object getServerMetric(CredentialInfo credentialInfo, RequestMetricInfo requestMetricInfo);

    String getServerVNCConsoleURL(CredentialInfo credentialInfo, String projectId, String serverId);

    String getServerConsoleOutput(CredentialInfo credentialInfo, String projectId, String serverId, int line);

    List<ActionLogInfo> getServerActionLog(CredentialInfo credentialInfo, String projectId, String serverId);

    List<VolumeInfo> getServerVolumes(CredentialInfo credentialInfo, String projectId, String serverId);

    VolumeInfo detachVolume(CredentialInfo credentialInfo, String projectId, String serverId, String volumeId);

    VolumeInfo attachVolume(CredentialInfo credentialInfo, String projectId, String serverId, String volumeId);

    List<? extends Hypervisor> getHypervisors(CredentialInfo credentialInfo);

    HypervisorStatistics getHypervisorStatistics(CredentialInfo credentialInfo);

    ResourceInfo getResourceUsage(CredentialInfo credentialInfo);

    Nodeinfo getMasterNode();

    Nodeinfo getTotalNode();

    Object getEdge();

    PodInfo getPods();

    NodeUsageinfo getNodeUsage();

}
