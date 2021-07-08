package com.innogrid.gedge.coreedge.model;

import com.google.api.client.json.JsonString;
import com.google.api.client.util.Key;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by kkm on 15. 4. 24.
 */
@Data
public class StatusPodInfo implements Serializable {
    private static final long serialVersionUID = 1779366790605206372L;
    @Key @JsonString private String phase;
    @Key @JsonString private String hostIP;
    @Key @JsonString private String podIP;
    @Key @JsonString private PodIpsInfo[] podIPs;
    @Key @JsonString private String startTime;
    @Key @JsonString private String qosClass;
    @Key @JsonString private PodContainerStatusesInfo[] containerStatuses;

    public StatusPodInfo(){}
}
