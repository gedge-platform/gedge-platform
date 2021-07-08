package com.innogrid.gedge.core.exception;

import org.springframework.core.NestedRuntimeException;

public class GedgeplatformUnAuthorizedException extends NestedRuntimeException {
    private String title = "";
    private String detail = "";

    public GedgeplatformUnAuthorizedException(String msg) {
        super(msg);
        this.title = msg;
        this.detail = msg;
    }

    public GedgeplatformUnAuthorizedException(String title, String detail) {
        super(title);
        this.title = title;
        this.detail = detail;
    }

    public String getTitle() {
        return title;
    }

    public String getDetail() {
        return detail;
    }
}
