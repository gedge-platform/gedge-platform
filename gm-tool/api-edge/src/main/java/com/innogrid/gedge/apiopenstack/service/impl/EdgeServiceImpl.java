package com.innogrid.gedge.apiopenstack.service.impl;

import com.innogrid.gedge.apiopenstack.service.EdgeService;
import com.innogrid.gedge.core.exception.GedgeplatformUnAuthorizedException;
import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.coreedge.model.*;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.openstack4j.api.Builders;
import org.openstack4j.api.OSClient;
import org.openstack4j.api.exceptions.AuthenticationException;
import org.openstack4j.api.exceptions.ClientResponseException;
import org.openstack4j.api.exceptions.ServerResponseException;
import org.openstack4j.model.common.ActionResponse;
import org.openstack4j.model.common.Identifier;
import org.openstack4j.model.compute.*;
import org.openstack4j.model.compute.FloatingIP;
import org.openstack4j.model.compute.builder.BlockDeviceMappingBuilder;
import org.openstack4j.model.compute.builder.ServerCreateBuilder;
import org.openstack4j.model.compute.ext.Hypervisor;
import org.openstack4j.model.compute.ext.HypervisorStatistics;
import org.openstack4j.model.identity.v3.Project;
import org.openstack4j.model.image.v2.Image;
import org.openstack4j.model.network.*;
import org.openstack4j.model.network.SecurityGroup;
import org.openstack4j.model.storage.block.Volume;
import org.openstack4j.model.storage.block.VolumeBackup;
import org.openstack4j.model.storage.block.VolumeSnapshot;
import org.openstack4j.openstack.OSFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.google.api.client.http.*;
import net.sf.json.JSONArray;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.concurrent.TimeUnit.MILLISECONDS;

/**
 * @author wss
 * @date 2019.7.10
 * @brief OpenStack API Service
 */
@Service
public class EdgeServiceImpl extends RestApiAbstract implements EdgeService {
    private final static Logger logger = LoggerFactory.getLogger(EdgeServiceImpl.class);

    private Map<String, List> projectMap = new HashMap<>();

    private OSClient getOpenstackClient(CredentialInfo info, String projectId) {
        OSFactory.enableHttpLoggingFilter(true);

        Identifier domainIdentifier = Identifier.byId(info.getDomain());
        OSClient os = null;
        try {
            if (info.getProjectId() == null) {
                os = OSFactory.builderV3()
                        .endpoint(info.getUrl())
                        .credentials(info.getAccessId(), info.getAccessToken(), domainIdentifier)
                        .authenticate();
            } else {
                if (projectId != null) {
                    os = OSFactory.builderV3()
                            .endpoint(info.getUrl())
                            .credentials(info.getAccessId(), info.getAccessToken(), domainIdentifier)
                            .scopeToProject(Identifier.byId(projectId))
                            .authenticate();
                } else {
                    os = OSFactory.builderV3()
                            .endpoint(info.getUrl())
                            .credentials(info.getAccessId(), info.getAccessToken(), domainIdentifier)
                            .scopeToProject(Identifier.byId(info.getProjectId()))
                            .authenticate();
                }
            }
        } catch (Exception e) {
            logger.error("Failed to get openstack credential : '{}'", e.getMessage());
            throw new GedgeplatformUnAuthorizedException(e.getMessage());
        }

        return os;
    }

    @Override
    public boolean validateCredential(CredentialInfo credentialInfo) {
        boolean isValid = true;

        try {
            OSClient os = getOpenstackClient(credentialInfo, null);

            List<? extends Project> projects = ((OSClient.OSClientV3) os).identity().projects().list();

            if(projects == null) {
                isValid = false;
            }

        } catch (Exception e) {
            logger.error("Failed to validate credential : '{}'", e.getMessage());
            isValid = false;
        }
        return isValid;
    }

    @Override
    public List<ServerInfo> getServers(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Server> openstackServers = os.compute().servers().list(new HashMap<String, String>(){{
            if(projectId == null) {
                put("all_tenants", "true");
            }
        }});

        List<ServerInfo> list = new ArrayList<>();
        for(int j=0; j<openstackServers.size(); j++) {
            Server server = openstackServers.get(j);

            ServerInfo info = new ServerInfo(server);

            if(info.getProjectId() != null) {
                info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
            }

            list.add(info);
        }

        return list;
    }

    @Override
    public ServerInfo getServer(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        Server openstackServer = os.compute().servers().get(serverId);

        ServerInfo info = new ServerInfo(openstackServer);
        if(info.getId() == null || info.getId().equals("")) {
            info.setId(serverId);
        }

        if(info.getProjectId() != null) {
            info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
        }

        return info;
    }

    @Override
    public List<ImageInfo> getImages(CredentialInfo credentialInfo, String projectId) {
        return getImages(credentialInfo, projectId, false);
    }

    @Override
    public List<ImageInfo> getImages(CredentialInfo credentialInfo, String projectId, Boolean active) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Image> openstackImages = os.imagesV2().list(new HashMap<String, String>(){{
            if(active) {
                put("status", "active");
            }
        }});

        List<ImageInfo> list = new ArrayList<>();
        for(int j=0; j<openstackImages.size(); j++) {
            Image image = openstackImages.get(j);

            ImageInfo info = new ImageInfo(image);

            list.add(info);
        }

        return list;
    }

    @Override
    public List<KeyPairInfo> getKeyPairs(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Keypair> openstackList = os.compute().keypairs().list();

        List<KeyPairInfo> list = new ArrayList<>();
        for(int j=0; j<openstackList.size(); j++) {
            Keypair keypair = openstackList.get(j);

            KeyPairInfo info = new KeyPairInfo(keypair);

            list.add(info);
        }

        return list;
    }

    @Override
    public List<FlavorInfo> getFlavors(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Flavor> openstackFlavors = os.compute().flavors().list();

        List<FlavorInfo> list = new ArrayList<>();
        for(int j=0; j<openstackFlavors.size(); j++) {
            Flavor flavor = openstackFlavors.get(j);

            FlavorInfo info = new FlavorInfo(flavor);

            list.add(info);
        }

        return list;
    }

    @Override
    public List<VolumeInfo> getVolumes(CredentialInfo credentialInfo, String projectId) {
        return getVolumes(credentialInfo, projectId, false, false);
    }

    @Override
    public List<VolumeInfo> getVolumes(CredentialInfo credentialInfo, String projectId, Boolean bootable, Boolean available) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Volume> openstackvolumes = os.blockStorage().volumes().list(new HashMap<String, String>(){{
            if(projectId == null) {
                put("all_tenants", "true");
            }
            if(bootable) {
                put("bootable", "true");
            }
            if(available) {
                put("status", "available");
            }
        }});
        List<VolumeInfo> list = new ArrayList<>();

        if(list.size() > 0) {
            List<ServerInfo> servers = getServers(credentialInfo, projectId);

            for (int j = 0; j < openstackvolumes.size(); j++) {
                Volume volume = openstackvolumes.get(j);

                VolumeInfo info = new VolumeInfo(volume);

                if (info.getProjectId() != null) {
                    info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
                }
                info.setServerNameForVolumeAttachmentInfos(servers);

                list.add(info);
            }
        }

        return list;
    }

    @Override
    public VolumeInfo getVolume(CredentialInfo credentialInfo, String projectId, String volumeId) {
        if(credentialInfo == null) return new VolumeInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        Volume openstackVolume = os.blockStorage().volumes().get(volumeId);
        VolumeInfo info = new VolumeInfo(openstackVolume);

        if(openstackVolume != null) {
            List<ServerInfo> servers = getServers(credentialInfo, projectId);

            if (info.getProjectId() != null) {
                info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
            }
            info.setServerNameForVolumeAttachmentInfos(servers);
        }

        return info;
    }

    @Override
    public List<VolumeBackupInfo> getBackups(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends VolumeBackup> openstackLists = os.blockStorage().backups().list(new HashMap<String, String>(){{
            if(projectId == null) {
                put("all_tenants", "true");
            }
        }});
        List<VolumeInfo> volumeInfos = getVolumes(credentialInfo, projectId);

        List<VolumeBackupInfo> list = new ArrayList<>();
        for(int j=0; j<openstackLists.size(); j++) {
            VolumeBackup openstack = openstackLists.get(j);

            VolumeBackupInfo info = new VolumeBackupInfo(openstack);
            List<VolumeInfo> result = volumeInfos.stream().filter(volume -> volume.getId().equals(info.getVolumeId())).collect(Collectors.toList());
            if(result.size() > 0) {
                info.setVolumeName(result.get(0).getName());
            }
            list.add(info);
        }

        return list;
    }

    @Override
    public List<VolumeSnapshotInfo> getSnapshots(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends VolumeSnapshot> openstackLists = os.blockStorage().snapshots().list(new HashMap<String, String>(){{
            if(projectId == null) {
                put("all_tenants", "true");
            }
        }});
        List<VolumeInfo> volumeInfos = getVolumes(credentialInfo, projectId);

        List<VolumeSnapshotInfo> list = new ArrayList<>();
        for(int j=0; j<openstackLists.size(); j++) {
            VolumeSnapshot openstack = openstackLists.get(j);

            VolumeSnapshotInfo info = new VolumeSnapshotInfo(openstack);
            List<VolumeInfo> result = volumeInfos.stream().filter(volume -> volume.getId().equals(info.getVolumeId())).collect(Collectors.toList());
            if(result.size() > 0) {
                info.setVolumeName(result.get(0).getName());
            }

            list.add(info);
        }

        return list;
    }

    @Override
    public List<NetworkInfo> getNetworks(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Network> openstackList = os.networking().network().list(new HashMap<String, String>(){{
            if(projectId != null) {
                put("project_id", projectId);
            }
        }});

        List<NetworkInfo> list = new ArrayList<>();
        for(int j=0; j<openstackList.size(); j++) {
            Network network = openstackList.get(j);

            NetworkInfo info = new NetworkInfo(network);

            if(info.getProjectId() != null) {
                info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
            }

            list.add(info);
        }

        return list;
    }

    @Override
    public List<RouterInfo> getRouters(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends Router> openstackList = null;

        if(projectId == null) {
            openstackList = os.networking().router().list();
        } else {
            openstackList = os.networking().router().list().stream().filter(r -> r.getTenantId().equals(projectId)).collect(Collectors.toList());
        }
        List<RouterInfo> list = new ArrayList<>();

        if(openstackList.size() > 0) {
            List<NetworkInfo> networks = getNetworks(credentialInfo, projectId);

            for (int j = 0; j < openstackList.size(); j++) {
                Router router = openstackList.get(j);

                RouterInfo info = new RouterInfo(router);

                if (router.getExternalGatewayInfo() != null && networks != null) {
                    List<NetworkInfo> result = networks.stream().filter(network -> network.getId().equals(info.getNetworkId())).collect(Collectors.toList());
                    if (result.size() > 0) info.setNetworkName(result.get(0).getName());
                    if (result.size() > 0) info.setVisibilityZones(result.get(0).getVisibilityZones());
                }

                if (info.getProjectId() != null) {
                    info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
                }

                list.add(info);
            }
        }

        return list;
    }

    @Override
    public List<SecurityGroupInfo> getSecurityGroups(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends SecurityGroup> openstackList = os.networking().securitygroup().list(new HashMap<String, String>(){{
            if(projectId != null) {
                put("project_id", projectId);
            }
        }});

        List<SecurityGroupInfo> list = new ArrayList<>();
        for(int j=0; j<openstackList.size(); j++) {
            SecurityGroup securityGroup = openstackList.get(j);

            SecurityGroupInfo info = new SecurityGroupInfo(securityGroup);

            list.add(info);
        }

        return list;
    }

    @Override
    public List<FloatingIpInfo> getFloatingIps(CredentialInfo credentialInfo, String projectId, Boolean down) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends NetFloatingIP> openstackList = os.networking().floatingip().list(new HashMap<String, String>(){{
            if(projectId != null){
                put("project_id", projectId);
            }
            if(down) {
                put("status", "down");
            }
        }});
        List<FloatingIpInfo> list = new ArrayList<>();

        if(openstackList.size() > 0) {
            List<ServerInfo> serverInfoList = getServers(credentialInfo, projectId);
            List<NetworkInfo> networks = getNetworks(credentialInfo, projectId);

            for (int i = 0; i < openstackList.size(); i++) {
                NetFloatingIP floatingIP = openstackList.get(i);

                FloatingIpInfo info = new FloatingIpInfo(floatingIP);
                if (info.getFixedIpAddress() != null && !info.getFixedIpAddress().equals("")) {
                    AddressInfo address;
                    for (int j = 0; j < serverInfoList.size(); j++) {
                        address = serverInfoList.get(j).getAddressInfo(info.getFixedIpAddress());
                        if (address != null) {
                            info.setServerName(serverInfoList.get(j).getName());
                            break;
                        }
                    }
                }

                List<NetworkInfo> result = networks.stream().filter(network -> network.getId().equals(info.getFloatingNetworkId())).collect(Collectors.toList());
                if (result.size() > 0) info.setNetworkName(result.get(0).getName());

                if (info.getTenantId() != null) {
                    info.setProjectName(getProjectName(credentialInfo, info.getTenantId()));
                }

                list.add(info);
            }
        }

        return list;
    }

    @Override
    public List<AvailabilityZoneInfo> getZones(CredentialInfo credentialInfo, String projectId, String type) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List openstackList = null;

        if(type.equals("compute")) {
            openstackList = os.compute().zones().list();
        } else if(type.equals("volume")) {
            openstackList = os.blockStorage().zones().list();
        }

        List<AvailabilityZoneInfo> list = new ArrayList<>();
        for(int i=0; i<openstackList.size(); i++) {
            AvailabilityZoneInfo info = new AvailabilityZoneInfo(openstackList.get(i));

            list.add(info);
        }

        return list;
    }

    @Override
    public List<String> getFloatingIpPoolNames(CredentialInfo credentialInfo, String projectId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<String> pools = os.compute().floatingIps().getPoolNames();

        return pools;
    }

    @Override
    public FloatingIpInfo allocateFloatingIp(CredentialInfo credentialInfo, String projectId, String poolName) {
        if(credentialInfo == null) return new FloatingIpInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        FloatingIP ip = os.compute().floatingIps().allocateIP(poolName);

        FloatingIpInfo info = new FloatingIpInfo(ip);

        return info;
    }

    @Override
    public Boolean deallocateFloatingIp(CredentialInfo credentialInfo, String projectId, String floatingIpId) {
        if(credentialInfo == null) return false;

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().floatingIps().deallocateIP(floatingIpId);

        if(ar.isSuccess()) {
            return true;
        } else {
            logger.error("Failed to deallocateFloatingIp : '{}'", ar.getFault());
            return false;
        }
    }

    @Override
    public Boolean addFloatingIpToServer(CredentialInfo credentialInfo, String projectId, String serverId, String interfaceIp, String floatingIp) {
        if(credentialInfo == null) return false;

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().floatingIps().addFloatingIP(serverId, interfaceIp, floatingIp);

        if(ar.isSuccess()) {
            return true;
        } else {
            logger.error("Failed to addFloatingIpToServer : '{}'", ar.getFault());
            return false;
        }
    }

    @Override
    public Boolean removeFloatingIpToServer(CredentialInfo credentialInfo, String projectId, String serverId, String floatingIp) {
        if(credentialInfo == null) return false;

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().floatingIps().removeFloatingIP(serverId, floatingIp);

        if(ar.isSuccess()) {
            return true;
        } else {
            logger.error("Failed to removeFloatingIpToServer : '{}'", ar.getFault());
            return false;
        }
    }

    @Override
    public Boolean attachInterface(CredentialInfo credentialInfo, String projectId, String serverId, String networkId) {
        if(credentialInfo == null) return null;

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        Port p = os.networking().port().create(Builders.port().networkId(networkId).build());

        InterfaceAttachment ia = os.compute().servers().interfaces().create(serverId, p.getId());

        if(ia != null) {
            return true;
        } else {
            logger.error("Failed to attachInterface");
            return false;
        }
    }

    @Override
    public Boolean detachInterface(CredentialInfo credentialInfo, String projectId, String serverId, String portId) {
        if(credentialInfo == null) return false;

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().interfaces().detach(serverId, portId);
        if(ar.isSuccess()) {
            ar = os.networking().port().delete(portId);
            if(ar.isSuccess()) {
                return true;
            } else {
                logger.error("Failed to detachInterfacePortDelete : '{}'", ar.getFault());
                return false;
            }
        } else {
            logger.error("Failed to detachInterface : '{}'", ar.getFault());
            return false;
        }
    }

    @Override
    public List<? extends InterfaceAttachment> getServerInterface(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return null;

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends InterfaceAttachment> list = os.compute().servers().interfaces().list(serverId);

        return list;
    }

    @Override
    public List<ProjectInfo> getProjects(CredentialInfo credentialInfo) {
        if(credentialInfo == null) return Collections.emptyList();

        List<ProjectInfo> list = new ArrayList<>();

        try {
            OSClient os = getOpenstackClient(credentialInfo, null);

            List<? extends Project> openstackList = ((OSClient.OSClientV3) os).identity().projects().list();


            for (int j = 0; j < openstackList.size(); j++) {
                Project project = openstackList.get(j);

                ProjectInfo info = new ProjectInfo(project);

                list.add(info);
            }
        } catch (AuthenticationException e) {
            logger.error("Failed to getProjects : '{}'", e.getMessage());
        } catch (ClientResponseException e) {
            logger.error("Failed to getProjects : '{}'", e.getMessage());
        }

        projectMap.put(credentialInfo.getId(), list);

        return list;
    }

    @Override
    public List<ProjectInfo> getProjectsInMemory(CredentialInfo credentialInfo) {
        List<ProjectInfo> projectInfos = projectMap.get(credentialInfo.getId());

        if(projectInfos != null) {
            return projectInfos;
        } else {
            return getProjects(credentialInfo);
        }
    }

    @Override
    public String getProjectName(CredentialInfo credentialInfo, String projectId) {
        List<ProjectInfo> projectInfos = getProjectsInMemory(credentialInfo);

        List<ProjectInfo> result = projectInfos.stream().filter(project -> project.getId().equals(projectId)).collect(Collectors.toList());
        if(result.size() > 0) {
            return result.get(0).getName();
        }

        return "";
    }

    @Override
    public ProjectInfo getProject(CredentialInfo credentialInfo, String projectId) {
        List<ProjectInfo> projectInfos = getProjectsInMemory(credentialInfo);
        List<ProjectInfo> result = projectInfos.stream().filter(project -> project.getId().equals(projectId)).collect(Collectors.toList());
        if(result.size() > 0) {
            return result.get(0);
        }
        return new ProjectInfo();
    }

    @Override
    public ServerInfo start(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.START);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to start : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo stop(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.STOP);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to stop : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo rebootSoft(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().reboot(serverId, RebootType.SOFT);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to rebootSoft : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo rebootHard(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().reboot(serverId, RebootType.HARD);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to rebootHard : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo delete(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().delete(serverId);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to delete : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo pause(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.PAUSE);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to pause : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo unpause(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.UNPAUSE);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to unpause : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo lock(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.LOCK);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to lock : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo unlock(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.UNLOCK);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to unlock : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo suspend(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.SUSPEND);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to suspend : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo resume(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.RESUME);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to resume : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo rescue(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.RESCUE);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to rescue : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo unrescue(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.UNRESCUE);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to unrescue : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo shelve(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.SHELVE);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to shelve : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo shelveOffload(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.SHELVE_OFFLOAD);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to shelveOffload : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo unshelve(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().action(serverId, Action.UNSHELVE);

        if(ar != null && ar.isSuccess()) {
            return getServer(credentialInfo, projectId, serverId);
        } else {
            logger.error("Failed to unshelve : '{}'", ar.getFault());
            return new ServerInfo();
        }
    }

    @Override
    public ServerInfo createServer(CredentialInfo credentialInfo, String projectId, CreateServerInfo createServerInfo) {
        if(credentialInfo == null) return new ServerInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        String name = createServerInfo.getName();
        String zone = createServerInfo.getZone();
        String type = createServerInfo.getSourceType();
        String id = createServerInfo.getSourceId();
        String flavor = createServerInfo.getFlavorId();
        List<String> networks = createServerInfo.getNetworks();
        List<String> securityGroups = createServerInfo.getSecurityGroups();
        String keyPair = createServerInfo.getKeyPair();
        Boolean configDrive = createServerInfo.getConfigDrive();
        String script = createServerInfo.getScript();
        Boolean deleteOnTermination = createServerInfo.getDeleteOnTermination();
        Boolean newVolume = createServerInfo.getNewVolume();
        Integer size = createServerInfo.getSize();

        ServerCreateBuilder sc = Builders.server().name(name).flavor(flavor).keypairName(keyPair);

        if(zone != null) {
            sc.availabilityZone(zone);
        }
        if(type.equals("image")) {
            sc.image(id);

            if(newVolume) {
                BlockDeviceMappingBuilder blockDeviceMappingBuilder = Builders.blockDeviceMapping()
                        .uuid(id)
                        .sourceType(BDMSourceType.IMAGE)
                        .deviceName("/dev/vda")
                        .volumeSize(size)
                        .bootIndex(0).destinationType(BDMDestType.LOCAL);

                if(deleteOnTermination) {
                    blockDeviceMappingBuilder.deleteOnTermination(true);
                }

                sc.blockDevice(blockDeviceMappingBuilder.build());
            }

        } else if(type.equals("volume")) {
            BlockDeviceMappingBuilder blockDeviceMappingBuilder = Builders.blockDeviceMapping()
                    .uuid(id)
                    .sourceType(BDMSourceType.VOLUME)
                    .deviceName("/dev/vda")
                    .bootIndex(0).destinationType(BDMDestType.LOCAL);

            if(deleteOnTermination) {
                blockDeviceMappingBuilder.deleteOnTermination(true);
            }

            sc.blockDevice(blockDeviceMappingBuilder.build());
        }

        if(sc == null) return new ServerInfo();

        for (String securityGroup : securityGroups) {
            sc.addSecurityGroup(securityGroup);
        }
        if (networks != null && !networks.isEmpty()) {
            sc.networks(networks);
        }

        if(configDrive != null) {
            sc.configDrive(configDrive);
        }

        if(script != null) {
            try {
                script = Base64.getEncoder().encodeToString(script.getBytes("UTF-8"));
                sc.userData(script);
            } catch (UnsupportedEncodingException uee) {
                logger.error("Failed to encode string to UTF-8 : '{}'", uee.getMessage());
            }
        }

        Server server = os.compute().servers().boot(sc.build());

        return getServer(credentialInfo, projectId, server.getId());
    }

    @Override
    public String createServerSnapshot(CredentialInfo credentialInfo, String projectId, String serverId, String snapshotName) {
        if(credentialInfo == null) return "";

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        String imageId = os.compute().servers().createSnapshot(serverId, snapshotName);

        return imageId;
    }

    @Override
    public Object getServerMetric(CredentialInfo credentialInfo, RequestMetricInfo requestMetricInfo) {
        if(credentialInfo == null) return "";

        // Declaration
        Map<String, Object> dataList = new HashMap<>();
        String INFLUX_DATABASE = "openstackit";
        int INFLUX_DB_QUERY_PORT = 8086;
        int CHECK_CPU_BASIC = 0b0000000001;
        int CHECK_DISK_BASIC = 0b0000000010;
        int CHECK_NETWORK_BASIC = 0b0000000100;
        int CHECK_MEMORY_USAGE = 0b0000001000;
        int CHECK_MEMORY = 0b0000010000;
        int CHECK_CPU = 0b0000100000;
        int CHECK_DISK_USAGE = 0b0001000000;
        int CHECK_LOAD = 0b0010000000;
        int CHECK_PROCESS = 0b0100000000;
        int CHECK_SWAP_USAGE = 0b1000000000;

        // Connect Influx
        String influxDBURL = credentialInfo.getUrl().split("//")[1].split(":")[0]; //"182.252.135.150";
        InfluxDB influxDB = InfluxDBFactory.connect("http://" + influxDBURL + ":" + INFLUX_DB_QUERY_PORT, "root", "root");

        // Chart Param
        Integer metricNum =  requestMetricInfo.getMetricName();
        String statistic = requestMetricInfo.getStatistic();
        Integer interval = requestMetricInfo.getInterval();
        Long endDate =  requestMetricInfo.getEndDate();
        Long startDate = requestMetricInfo.getStartDate();

        String function = "MEAN";

        if (!statistic.equals("")) {
            function = statistic;
        }

        try {
            List<String> chartType = new ArrayList<>();

            if ((metricNum & CHECK_CPU_BASIC) > 0) {
                chartType.add(String.format("%s(cpu_utilization) AS serverCpuUsageCPU", function));
            }
            if ((metricNum & CHECK_DISK_BASIC) > 0) {
                chartType.add(String.format("%s(bytes_read) AS serverDiskRead", function));
                chartType.add(String.format("%s(bytes_written) AS serverDiskWrite", function));
            }
            if ((metricNum & CHECK_NETWORK_BASIC) > 0) {
                chartType.add(String.format("%s(bytes_in) AS serverNetworkOutput", function));
                chartType.add(String.format("%s(bytes_out) AS serverNetworkInput", function));
            }
            if ((metricNum & CHECK_MEMORY_USAGE) > 0) {
                chartType.add(String.format("%s(mem_utilization) AS serverMemoryUsageMEM", function));
            }
            if ((metricNum & CHECK_MEMORY) > 0) {
                chartType.add(String.format("%s(mem_buffers) AS serverMemorybuffers", function));
                chartType.add(String.format("%s(mem_cached) AS serverMemorycached", function));
                chartType.add(String.format("%s(mem_free) AS serverMemoryfree", function));
                chartType.add(String.format("%s(mem_shared) AS serverMemoryshared", function));
            }
            if ((metricNum & CHECK_CPU) > 0) {
                chartType.add(String.format("%s(cpu_intr) AS serverCpuintr", function));
                chartType.add(String.format("%s(cpu_system) AS serverCpusystem", function));
                chartType.add(String.format("%s(cpu_user) AS serverCpuuser", function));
                chartType.add(String.format("%s(cpu_idle) AS serverCpuidle", function));
            }
            if ((metricNum & CHECK_DISK_USAGE) > 0) {
                chartType.add(String.format("%s(disk_utilization) AS serverDiskUsageDisk", function));
            }
            if ((metricNum & CHECK_LOAD) > 0) {
                chartType.add(String.format("%s(load_fifteen) AS serverLoad15minute", function));
                chartType.add(String.format("%s(load_five) AS serverLoad5minute", function));
                chartType.add(String.format("%s(load_one) AS serverLoad1minute", function));
            }
            if ((metricNum & CHECK_PROCESS) > 0) {
                chartType.add(String.format("%s(proc_run) AS serverProcessrun", function));
                chartType.add(String.format("%s(proc_total) AS serverProcesstotal", function));
            }
            if ((metricNum & CHECK_SWAP_USAGE) > 0) {
                chartType.add(String.format("(%s(swap_total)-%s(swap_free)) / %s(swap_total) * 100 AS serverSwapUsageSwap", function, function, function));
            }

            String columns = StringUtils.collectionToDelimitedString(chartType, ",");
            String queryString = String.format("SELECT %s FROM vm_stat WHERE uuid='%s' AND time >= %ds AND time < %ds GROUP BY time(%ds) ORDER BY time asc", columns, requestMetricInfo.getId(), startDate, endDate, interval);
            System.out.println(queryString);

            Query query = new Query(queryString, INFLUX_DATABASE);
            influxDB.setLogLevel(InfluxDB.LogLevel.FULL);
            QueryResult queryResult = influxDB.query(query, MILLISECONDS);

            List<QueryResult.Result> results = queryResult.getResults();
            if(results.get(0) != null ){
                List<QueryResult.Series> series = results.get(0).getSeries();
                if(series != null){
                    List<List<Object>> values = series.get(0).getValues();

                    for(String chart : chartType){
                        List<Object> d = new ArrayList<>();
                        for(List<Object> value : values){
                            int index = chartType.indexOf(chart)+1;
                            if(value.get(index) != null){
                                d.add(value.get(index));
                            }
                        }
                        if(chart.split(" ")[2].equals("MEAN(swap_total)") ){
                            dataList.put("serverSwapUsageSwap", d);
                        }else{
                            dataList.put(chart.split(" ")[2], d);
                        }
                    }
                }else{ // create empty structure
                    for(String chart : chartType){
                        List<Object> d = new ArrayList<>();
                        if(chart.split(" ")[2].equals("MEAN(swap_total)") ){
                            dataList.put("serverSwapUsageSwap", d);
                        }else{
                            dataList.put(chart.split(" ")[2], d);
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Failed to get ServerMetric : '{}'", e.getMessage());
            System.out.println(e.getMessage());
        }
        influxDB.close();
        return dataList;
    }

    @Override
    public String getServerVNCConsoleURL(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return "";

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        VNCConsole console = null;
        try {
            console = os.compute().servers().getVNCConsole(serverId, VNCConsole.Type.NOVNC);
        } catch (ClientResponseException cre) {
            logger.error("Fail getServerVNCConsoleURL - NOVNC {}", cre.getMessage());
            try {
                console = os.compute().servers().getVNCConsole(serverId, VNCConsole.Type.SPICE);
            } catch (ClientResponseException cre2) {
                logger.error("Fail getServerVNCConsoleURL - SPICE {}", cre2.getMessage());
            } catch (ServerResponseException sre) {
                logger.error("Fail getServerVNCConsoleURL {}", sre.getMessage());
            }
        } catch (ServerResponseException sre) {
            logger.error("Fail getServerVNCConsoleURL {}", sre.getMessage());
        }
        return console != null? console.getURL():"";
    }

    @Override
    public String getServerConsoleOutput(CredentialInfo credentialInfo, String projectId, String serverId, int line) {
        if(credentialInfo == null) return "";

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        String output = "";

        try {
            output = os.compute().servers().getConsoleOutput(serverId, line);
        } catch (ClientResponseException cre) {
            logger.error("Failed to get ServerConsoleOutput : '{}'", cre.getMessage());
        }
        return output;
    }

    @Override
    public List<ActionLogInfo> getServerActionLog(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<? extends InstanceAction> openstackList = os.compute().servers().instanceActions().list(serverId);

        List<ActionLogInfo> list = new ArrayList<>();
        for(int j=0; j<openstackList.size(); j++) {
            InstanceAction action = openstackList.get(j);

            ActionLogInfo info = new ActionLogInfo(action);

            list.add(info);
        }

        return list;
    }

    @Override
    public List<VolumeInfo> getServerVolumes(CredentialInfo credentialInfo, String projectId, String serverId) {
        if(credentialInfo == null) return Collections.emptyList();

        List<VolumeInfo> list = new ArrayList<>();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        List<VolumeInfo> volumes = getVolumes(credentialInfo, projectId);

        if(volumes.size() > 0) {
            List<String> attachedVolumes = os.compute().servers().get(serverId).getOsExtendedVolumesAttached();

            for (int i = 0; i < volumes.size(); i++) {
                if (attachedVolumes.contains(volumes.get(i).getId())) {
                    list.add(volumes.get(i));
                }
            }
        }

        return list;
    }

    @Override
    public VolumeInfo detachVolume(CredentialInfo credentialInfo, String projectId, String serverId, String volumeId) {
        if(credentialInfo == null) return new VolumeInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        ActionResponse ar = os.compute().servers().detachVolume(serverId, volumeId);

        if(ar != null && ar.isSuccess()) {
            Volume volume = os.blockStorage().volumes().get(volumeId);

            VolumeInfo info = new VolumeInfo(volume);

            if(info.getProjectId() != null) {
                info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
            }
            return info;
        } else {
            logger.error("Failed to get ServerMetric : '{}'", ar.getFault());
            return new VolumeInfo();
        }
    }

    @Override
    public VolumeInfo attachVolume(CredentialInfo credentialInfo, String projectId, String serverId, String volumeId) {
        if(credentialInfo == null) return new VolumeInfo();

        OSClient os = getOpenstackClient(credentialInfo, projectId);

        os.compute().servers().attachVolume(serverId, volumeId, null);

        Volume volume = os.blockStorage().volumes().get(volumeId);

        Server server = os.compute().servers().get(serverId);

        ServerInfo serverInfo = new ServerInfo(server);

        VolumeInfo info = new VolumeInfo(volume);

        if(info.getProjectId() != null) {
            info.setProjectName(getProjectName(credentialInfo, info.getProjectId()));
        }
        info.setServerNameForVolumeAttachmentInfos(Collections.singletonList(serverInfo));

        return info;
    }

    @Override
    public List<? extends Hypervisor> getHypervisors(CredentialInfo credentialInfo) {
        if(credentialInfo == null) return Collections.emptyList();

        OSClient os = getOpenstackClient(credentialInfo, null);

        return os.compute().hypervisors().list();
    }

    @Override
    public HypervisorStatistics getHypervisorStatistics(CredentialInfo credentialInfo) {
        if(credentialInfo == null) return null;

        OSClient os = getOpenstackClient(credentialInfo, null);

        return os.compute().hypervisors().statistics();
    }

    @Override
    public ResourceInfo getResourceUsage(CredentialInfo credentialInfo) {
        if(credentialInfo == null) return null;

        OSClient os = getOpenstackClient(credentialInfo, null);

        ResourceInfo info = new ResourceInfo();

        List<? extends Server> openstackServers = os.compute().servers().list(new HashMap<String, String>(){{
            put("all_tenants", "true");
        }});
        List<? extends Server> running = openstackServers.stream().filter(server -> server.getStatus() == Server.Status.ACTIVE).collect(Collectors.toList());
        List<? extends Server> stop = openstackServers.stream().filter(server -> server.getStatus() == Server.Status.SHUTOFF).collect(Collectors.toList());
        List<? extends Image> openstackImages = os.imagesV2().list(new HashMap<String, String>(){{}});
        List<? extends Flavor> openstackFlavors = os.compute().flavors().list();
        List<? extends Keypair> openstackKeyPairs = os.compute().keypairs().list();
        List<? extends Volume> openstackVolumes = os.blockStorage().volumes().list(new HashMap<String, String>(){{
            put("all_tenants", "true");
        }});
        List<? extends VolumeBackup> openstackBackups = os.blockStorage().backups().list(new HashMap<String, String>(){{
            put("all_tenants", "true");
        }});
        List<? extends VolumeSnapshot> openstackSnapshots = os.blockStorage().snapshots().list(new HashMap<String, String>(){{
            put("all_tenants", "true");
        }});
        List<? extends Network> openstackNetworks = os.networking().network().list(new HashMap<String, String>(){{

        }});
        List<? extends Router> openstackRouters = os.networking().router().list();
        List<? extends SecurityGroup> openstackSecurityGroups = os.networking().securitygroup().list(new HashMap<String, String>(){{}});
        List<? extends NetFloatingIP> openstackFloatingIps = os.networking().floatingip().list(new HashMap<String, String>(){{}});
        List<ProjectInfo> openstackProjects = getProjectsInMemory(credentialInfo);
        HypervisorStatistics hypervisorStatistics = os.compute().hypervisors().statistics();

        info.setRunning(running.size());
        info.setStop(stop.size());
        info.setEtc(openstackServers.size() - (running.size() + stop.size()));
        info.setImages(openstackImages.size());
        info.setFlavor(openstackFlavors.size());
        info.setKeyPairs(openstackKeyPairs.size());
        info.setVolumes(openstackVolumes.size());
        info.setBackups(openstackBackups.size());
        info.setSnapshots(openstackSnapshots.size());
        info.setNetworks(openstackNetworks.size());
        info.setRouters(openstackRouters.size());
        info.setSecurityGroups(openstackSecurityGroups.size());
        info.setFloatingIps(openstackFloatingIps.size());
        info.setProjects(openstackProjects.size());
        info.setHypervisorVcpus(hypervisorStatistics.getVirtualCPU());
        info.setHypervisorVcpusUsed(hypervisorStatistics.getVirtualUsedCPU());
        info.setHypervisorMemory(hypervisorStatistics.getMemory());
        info.setHypervisorMemoryUsed(hypervisorStatistics.getMemoryUsed());
        info.setHypervisorDisk(hypervisorStatistics.getLocal());
        info.setHypervisorDiskUsed(hypervisorStatistics.getLocalUsed());

        return info;
    }

    @Override
    public Nodeinfo getMasterNode() {

        Nodeinfo info = new Nodeinfo();

        logger.error("getMasterNode info = " + info);

        try{
            HttpRequest getRequest = jsonRequestFactory.buildGetRequest(new GenericUrl(NODE_MASTER));
            info = getRequest.execute().parseAs(Nodeinfo.class);
            logger.error("getMasterNode info = " + info);

        }catch(IOException e){
            e.printStackTrace();
        }
        return info;
    }

    @Override
    public Nodeinfo getTotalNode() {

        Nodeinfo info = new Nodeinfo();

        logger.error("getTotalNode info = " + info);

        try{
            HttpRequest getRequest = jsonRequestFactory.buildGetRequest(new GenericUrl(NODE_TOTAL));
            info = getRequest.execute().parseAs(Nodeinfo.class);
            logger.error("getTotalNode info = " + info);

        }catch(IOException e){
            e.printStackTrace();
        }
        return info;
    }

    @Override
    public Object getEdge() {

        String info = null;

        logger.error("getEdge info = " + info);

        try{
            HttpRequest getRequest = jsonRequestFactory.buildGetRequest(new GenericUrl(GET_EDGE));
            logger.error(getRequest.execute().parseAsString());
//            EdgesInfo info2 = getRequest.execute().parseAs(EdgesInfo.class);

            info = getRequest.execute().parseAsString();

        }catch(IOException e){
            e.printStackTrace();
        }

        JSONArray jsonArray = JSONArray.fromObject(info);
        return jsonArray;
    }

    @Override
    public PodInfo getPods() {

        PodInfo info = new PodInfo();

        logger.error("getPods info = " + info);

        try{
            HttpRequest getRequest = jsonRequestFactory.buildGetRequest(new GenericUrl(PODS));
            info = getRequest.execute().parseAs(PodInfo.class);
            logger.error("getPods info = " + info);

        }catch(IOException e){
            e.printStackTrace();
        }
        return info;
    }

    @Override
    public NodeUsageinfo getNodeUsage() {

        NodeUsageinfo info = new NodeUsageinfo();

        logger.error("getNodeUsage info = " + info);

        try{
            HttpRequest getRequest = jsonRequestFactory.buildGetRequest(new GenericUrl(NODE_USAGE));
            info = getRequest.execute().parseAs(NodeUsageinfo.class);
            logger.error("getNodeUsage info = " + info);

        }catch(IOException e){
            e.printStackTrace();
        }
        return info;
    }
}
