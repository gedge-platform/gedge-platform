package com.innogrid.gedge.coreedge.model;

import com.google.api.client.json.JsonString;
import com.google.api.client.util.Key;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by kkm on 15. 4. 24.
 */
@Data
public class CapacityInfo implements Serializable {
    private static final long serialVersionUID = 1779366790605206372L;
    @Key @JsonString private Integer cpu;
    @Key @JsonString private String memory;
    @Key @JsonString private String ephemeral_storage;
    @Key @JsonString private Integer pods;

    public CapacityInfo(){}
}
