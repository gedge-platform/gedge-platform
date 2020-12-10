package com.innogrid.gedge.coreedge.model;

import com.google.api.client.json.JsonString;
import com.google.api.client.util.Key;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by kkm on 15. 4. 24.
 */
@Data
public class StatusNodeInfo implements Serializable {
    private static final long serialVersionUID = 1779366790605206372L;
    @Key @JsonString private String machineID;
    @Key @JsonString private String systemUUID;
    @Key @JsonString private String bootID;
    @Key @JsonString private String kernelVersion;
    @Key @JsonString private String osImage;
    @Key @JsonString private String containerRuntimeVersion;
    @Key @JsonString private String kubeletVersion;
    @Key @JsonString private String kubeProxyVersion;
    @Key @JsonString private String operatingSystem;
    @Key @JsonString private String architecture;
    @Key @JsonString private String state;
    @Key @JsonString private String role;


    public StatusNodeInfo(){
        this.state = "active";
    }
}
