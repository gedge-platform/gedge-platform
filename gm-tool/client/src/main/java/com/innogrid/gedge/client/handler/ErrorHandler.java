package com.innogrid.gedge.client.handler;

import com.innogrid.gedge.client.exception.ValidationFailException;
import com.innogrid.gedge.core.exception.GedgeplatformUnAuthorizedException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;


@ControllerAdvice
public class ErrorHandler {

    private final Log logger = LogFactory.getLog(ErrorHandler.class);

//    @Autowired
//    private MessageSource messageSource;

    @ExceptionHandler({ValidationFailException.class,
            NumberFormatException.class,
            NullPointerException.class,
            IllegalArgumentException.class,
            MissingServletRequestParameterException.class,
            MissingRequestHeaderException.class,
            SQLIntegrityConstraintViolationException.class,
            DuplicateKeyException.class
    })
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public Map<String, Object> handlerError400(Exception e) {
        return translate(e);
    }

    @ExceptionHandler({Exception.class})
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Map<String, Object> handleError500(HttpServletRequest request, Exception e) {
        return translate(e);
    }

//    @ExceptionHandler({AccessDeniedException.class})
//    @ResponseStatus(FORBIDDEN)
//    @ResponseBody
//    public Map<String, Object> handleError403(AccessDeniedException e) {
//        return translate(e);
//    }

    @ExceptionHandler({HttpMediaTypeNotSupportedException.class})
    @ResponseStatus(UNSUPPORTED_MEDIA_TYPE)
    @ResponseBody
    public Map<String, Object> handleError415(Exception e) {
        return translate(e);
    }

    @ExceptionHandler({HttpMediaTypeNotAcceptableException.class})
    @ResponseStatus(NOT_ACCEPTABLE)
    @ResponseBody
    public Map<String, Object> handleError406(Exception e) {
        return translate(e);
    }

    @ExceptionHandler({NoHandlerFoundException.class})
    @ResponseStatus(NOT_FOUND)
    @ResponseBody
    public Map<String, Object> handleError404(Exception e) {
        return translate(e);
    }

    @ExceptionHandler({HttpRequestMethodNotSupportedException.class})
    @ResponseStatus(METHOD_NOT_ALLOWED)
    @ResponseBody
    public Map<String, Object> handleError405(Exception e) {
        return translate(e);
    }

    @ExceptionHandler({AccessDeniedException.class, GedgeplatformUnAuthorizedException.class})
    @ResponseStatus(UNAUTHORIZED)
    @ResponseBody
    public Map<String, Object> handleError401(Exception e) {
        return translate(e);
    }


    private Map<String, Object> translate(Throwable e) {

        String title;
        String detail;
        String type;

//        if(messageSource != null) {
//            try{
//                message = messageSource.getMessage(e.getMessage(), null, Locale.getDefault());
//            }catch(NoSuchMessageException ee) {
//                logger.error(ee);
//                message = e.getMessage();
//            }
//
//
//        }

        Map<String, Object> errors = new HashMap<String, Object>();

        if(e instanceof AccessDeniedException || e instanceof GedgeplatformUnAuthorizedException) {
            if(e instanceof GedgeplatformUnAuthorizedException) {
                GedgeplatformUnAuthorizedException cue = (GedgeplatformUnAuthorizedException) e;
                title = cue.getTitle();
                detail = cue.getDetail();
            } else {
                title = e.getMessage();
                detail = e.getMessage();
            }
            type = "4001";
        } else if(e instanceof HttpMediaTypeNotSupportedException) {
            HttpMediaTypeNotSupportedException hmtnse = (HttpMediaTypeNotSupportedException) e;
            title = hmtnse.getMessage();
            detail = hmtnse.getMessage();
            type = "4015";
        } else if(e instanceof HttpMediaTypeNotAcceptableException) {
            HttpMediaTypeNotAcceptableException hmenae = (HttpMediaTypeNotAcceptableException) e;
            title = hmenae.getMessage();
            detail = hmenae.getMessage();
            type = "4006";
        } else if(e instanceof NoHandlerFoundException) {
            NoHandlerFoundException nfe = (NoHandlerFoundException) e;
            title = nfe.getMessage();
            detail = nfe.getMessage();
            type = "4004";
        } else if(e instanceof HttpRequestMethodNotSupportedException) {
            HttpRequestMethodNotSupportedException mnae = (HttpRequestMethodNotSupportedException) e;
            title = mnae.getMessage();
            detail = mnae.getMessage();
            type = "4005";
        } else if(e instanceof MissingServletRequestParameterException || e instanceof MissingRequestHeaderException) {
            title = e.getMessage();
            detail = e.getMessage();
            type = "4101";
        }  else if(e instanceof SQLIntegrityConstraintViolationException || e instanceof DuplicateKeyException) {
            title = e.getMessage();
            detail = e.getMessage();
            type = "4100";
        } else if(e instanceof ValidationFailException || e instanceof NumberFormatException || e instanceof NullPointerException || e instanceof IllegalArgumentException) {
            title = e.getMessage();
            detail = e.getMessage();
            type = "4102";
        } else {
            title = e.getMessage();
            detail = e.getMessage();
            type = "5000";
        }

        errors.put("type", type == null ? "" : type);
        errors.put("title", title == null ? "" : title);
        errors.put("detail", detail == null ? "" : detail);

        logger.error("Error - " + errors );

        e.printStackTrace();

        return errors;
    }
}
