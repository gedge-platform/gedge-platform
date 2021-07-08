package com.innogrid.gedge.coreedge.model;

import com.google.api.client.util.Key;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by kkm on 15. 4. 24.
 */
@Data
public class NodeUsageinfo implements Serializable {
    private static final long serialVersionUID = 1779366790605206372L;
    @Key private NodeUsageItemInfo[] items;

    public NodeUsageinfo(){}
}
