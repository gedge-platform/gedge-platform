package com.innogrid.gedge.client.exception;

import org.springframework.core.NestedRuntimeException;

public class ValidationFailException extends NestedRuntimeException {

    public ValidationFailException(String msg) {
        super(msg);
    }

}
