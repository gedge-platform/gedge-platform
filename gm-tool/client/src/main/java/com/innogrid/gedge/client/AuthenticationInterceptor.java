package com.innogrid.gedge.client;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.innogrid.gedge.client.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class AuthenticationInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    private TokenService tokenService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

//        HttpSession session = request.getSession(true);
//
//        String token = (String)session.getAttribute(TokenService.COOKIE_IN_TOKEN_NAME);
//
//        if(token == null) tokenService.getTokenFromCookie(request);
//
//        try {
//            if(token!=null) {
//                if(tokenService.ValidateToken(tokenService.getPublicKey(),token,request,response)) {
//                    return true;
//                } else {
//                    response.sendRedirect("/logout");
//
//                    return false;
//                }
//            } else {
//                response.sendRedirect("/logout");
//
//                return false;
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//
//            response.sendRedirect("/?error="+e.getMessage());
//        } finally {
//
//        }

        return super.preHandle(request, response, handler);
    }
}
