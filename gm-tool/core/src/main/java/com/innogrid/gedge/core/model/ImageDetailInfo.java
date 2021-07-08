package com.innogrid.gedge.core.model;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

/**
 * @author khk
 * @date 2019.5.31
 * @brief 클라우드 별 이미지 상세 정보를 담는 클래스
 */
@Data
public class ImageDetailInfo implements Serializable {
    private static final long serialVersionUID = -6514621747720482703L;
    private String id;
    private String type;
    private String name;
    private String publisher;
    private String osType;
    private String architecture;
    private String hypervisor;
    private String virtualizationType;
    private String rootDeviceType;
    private String enaSupport;
    private String description;
    private String location;

    public ImageDetailInfo() {

    }

    public ImageDetailInfo(Map<String, Object> params) {
        this.id = checkNull(params.get("id"));
        this.type = checkNull(params.get("type"));
        this.name = checkNull(params.get("name"));
        this.publisher = getPublisherName(checkNull(params.get("publisher")));
        this.osType = getOsType(checkNull(params.get("osType")));
        this.architecture = checkNull(params.get("architecture"));
        this.hypervisor = checkNull(params.get("hypervisor"));
        this.virtualizationType = checkNull(params.get("virtualizationType"));
        this.rootDeviceType = checkNull(params.get("rootDeviceType"));
        this.enaSupport = checkNull(params.get("enaSupport"));
        this.description = checkNull(params.get("description"));
        this.location = checkNull(params.get("location"));
    }

    private String checkNull(Object strObj) {
        return strObj != null ? strObj.toString() : null;
    }

    // OS 정보 가져오기
    private String getOsType(String osType) {
        if(this.type.equals("aws")) {
            String osTypeName = "";

            if(osType == null) {
                String imageName = this.name.toUpperCase();
                if(imageName.contains("RHEL")) {
                    osTypeName = "RHEL";
                } else if(imageName.contains("SUSE")) {
                    osTypeName = "SUSE";
                } else {
                    osTypeName = "Linux";
                }
            } else {
                if(osType.toUpperCase().equals("WINDOWS")) osTypeName = "Windows";
            }

            return osTypeName;
        } else {
            return osType;
        }
    }

    // Publisher 정보 가져오기
    private String getPublisherName(String publisher) {
        if(this.type.equals("azure")) {
            String publisherName = "";
            if(publisher.toUpperCase().contains("MICROSOFT")) {
                publisherName = "Microsoft";
            } else {
                publisherName = publisher;
            }
            return publisherName;
        } else {
            return publisher;
        }
    }
}
