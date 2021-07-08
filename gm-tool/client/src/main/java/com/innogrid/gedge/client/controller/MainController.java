package com.innogrid.gedge.client.controller;

import com.innogrid.gedge.client.service.TokenService;
import com.innogrid.gedge.client.util.CommonUtil;
import com.innogrid.gedge.client.util.CookieUtil;
import com.innogrid.gedge.core.model.UserInfo;
import com.innogrid.gedge.coredb.service.AuthService;
import com.innogrid.gedge.coredb.service.CredentialService;
import com.innogrid.gedge.coredb.service.ProjectService;
import com.innogrid.gedge.coredb.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by root on 15. 3. 31.
 */
@Controller
@RequestMapping("")
public class MainController {
    private static Logger logger = LoggerFactory.getLogger(MainController.class);

    @Autowired
    private ServletContext context;

    @Autowired
    private CredentialService credentialService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

//    private static String authorizationRequestBaseUri = "oauth2/authorization";
//    Map<String, String> oauth2AuthenticationUrls = new HashMap<>();
//
//    @Autowired
//    private ClientRegistrationRepository clientRegistrationRepository;

//    @RequestMapping(value="/login", method = RequestMethod.GET)
//    public String getLogin(HttpServletRequest request, HttpSession session,
//                           HttpServletResponse response, Model model) {
//        getLocale(session, request, response);
//
////        Iterable<ClientRegistration> clientRegistrations = null;
////        ResolvableType type = ResolvableType.forInstance(clientRegistrationRepository)
////                .as(Iterable.class);
////        if (type != ResolvableType.NONE &&
////                ClientRegistration.class.isAssignableFrom(type.resolveGenerics()[0])) {
////            clientRegistrations = (Iterable<ClientRegistration>) clientRegistrationRepository;
////        }
////
////        clientRegistrations.forEach(registration ->
////                oauth2AuthenticationUrls.put(registration.getClientName(),
////                        authorizationRequestBaseUri + "/" + registration.getRegistrationId()));
////        model.addAttribute("urls", oauth2AuthenticationUrls);
//
//        return "index";
//    }

    @RequestMapping(value="/login", method = RequestMethod.GET)
    public String getLogin(HttpServletRequest request, HttpSession session,
                           HttpServletResponse response, Model model) {
        getLocale(session, request, response);

        return "index";
    }

//    @RequestMapping(value = "/login/oauth2", method = RequestMethod.GET)
//    public void login(HttpServletRequest request, HttpServletResponse response) {
//        String tokenCheck = tokenService.getTokenFromCookie(request);
//
//        try {
//            // Token 없음
//            if(tokenCheck == null) {
//                String authCodeUrl = tokenService.getAuthCode(request);
//                response.sendRedirect(authCodeUrl);
//
//            // Token 존재
//            }else {
//
//                boolean result = false;
//                // 토큰 정상
//                if(tokenService.ValidateToken(tokenService.getPublicKey(), tokenCheck, request, response)) {
//                    result = setSessionUser(request, response, null);
//
//                // 토큰 만료 등등.. 삭제 후 재발급 요청
//                } else {
//                    tokenService.removeCookie(request, response);
//                    tokenService.removeSpringCookie(request, response);
//                    tokenService.removeSession(request);
//
//                    String authCodeUrl = tokenService.getAuthCode(request);
//                    response.sendRedirect(authCodeUrl);
//                }
//
//                if(result == true) response.sendRedirect("/");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }finally {
//        }
//    }
//
//    private boolean setSessionUser(HttpServletRequest request, HttpServletResponse response, String recToken) {
//        boolean result = true;
//        try {
//
//            String token = tokenService.getTokenFromCookie(request);
//            String refreshToken = tokenService.getRefreshTokenFromCookie(request);
//
//            if(recToken != null) {
//                JsonParser parser = new JsonParser();
//
//                JsonObject tokenData = parser.parse(recToken).getAsJsonObject();
//
//                token = tokenData.get("access_token").getAsString();
//                refreshToken = tokenData.get("refresh_token").getAsString();
//            }
//
//            HttpSession session = request.getSession(true);
//            session.setAttribute(TokenService.COOKIE_IN_TOKEN_NAME, token);
//            session.setAttribute("refreshToken", refreshToken);
//
//            UserInfo info = tokenService.callGetInfo(token);
//
//            Map<String, Object> params = new HashMap<>();
//            params.put("id", info.getNewId());
//
//            UserInfo dbUser = userService.getUserInfo(params);
////            UserInfo dbUser = new UserInfo();
////            dbUser.setId("gedgeplatform08");
////            dbUser.setName("test");
////            dbUser.setEnabled(true);
////            dbUser.setAdmin(true);
//
//            if (dbUser == null) {
//                info = userService.createUser(info, info);
//            } else {
//                info = dbUser;
//            }
//
//            UserDetails userDetails = authService.loadUserByUsername(info.getId());
//            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities()));
//            SecurityContext securityContext = SecurityContextHolder.getContext();
//            securityContext.setAuthentication(authentication);
//            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
//
//            session.setAttribute("userInfo", info);
//
//            long nowTime = System.currentTimeMillis();
//
//            Timestamp lastVisit = info.getLogin();
//            info.setLogin(new Timestamp(nowTime));
//            info.setPassword(null);
//            userService.updateUser(info, null);
//
//            if (lastVisit == null) {
//                lastVisit = new Timestamp(nowTime);
//            }
//
//            session.setAttribute("lastVisit", lastVisit);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            result = false;
//            try {
//                response.sendRedirect("/?error="+e.getMessage());
//            } catch (IOException ie) {
//
//            }
//        }
//
//        return result;
//    }

//    @RequestMapping(value = "/login/oauth2/code/city-hub", method = RequestMethod.GET)
//    public void getToken(  @RequestParam(value="code", required=false) String code,
//                           @RequestParam(value="state", required=false)String state,
//                           HttpServletResponse response,
//                           HttpServletRequest request)  {
//
//        if(code==null) {
//            try {
//                response.sendRedirect("/logout");
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//
//        String token = tokenService.getTokenByAuthorizationCode(code);
//
//        try {
//            if(token != null) {
////                tokenService.removeCookie(request, response);
////                tokenService.removeRefreshCookie(request, response);
////                tokenService.cookieAddTokenByJson(response, token);
//
//                boolean result = setSessionUser(request, response, token);
//
//                if(result == true) response.sendRedirect("/");
//            }else {
//                response.sendRedirect("/logout");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }finally {
//        }
//    }

    @RequestMapping(value="/management/setting", method = RequestMethod.GET)
    public String getSetting(HttpServletRequest request, HttpSession session,
                             HttpServletResponse response, Model model) {
        model.addAttribute("name", "Setting");

        return "view/web";
    }

    @RequestMapping(value = {"/","/index"}, method = RequestMethod.GET)
    public String getHome(HttpServletRequest request, Principal principal, HttpSession session, HttpServletResponse response, Model model) {

        getLocale(session, request, response);

        if(logger.isDebugEnabled()) {
            logger.debug("Index page was accessed...");
        }

        if(principal != null) {

            UserInfo info = (UserInfo) session.getAttribute("userInfo");

            CommonUtil.setSessionCloudList(session, credentialService, projectService);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

            if(info != null) {

//                String token = (String)session.getAttribute(TokenService.COOKIE_IN_TOKEN_NAME);
//                String refreshToken = (String)session.getAttribute("refreshToken");
//
//                if(token != null && tokenService.getTokenFromCookie(request) == null) {
//                    tokenService.cookieAddToken(response, token, refreshToken);
//                }


//                try {
//                    if(authorities.contains(new SimpleGrantedAuthority("ROLE_CREDENTIAL_READ")) || authorities.contains(new SimpleGrantedAuthority("ROLE_CREDENTIAL_WRITE"))) {
//                        response.sendRedirect("/dashboard/servicedashboard");
//                    } else if(authorities.contains(new SimpleGrantedAuthority("ROLE_CLOUD_READ")) || authorities.contains(new SimpleGrantedAuthority("ROLE_CLOUD_WRITE"))){
//                        if(clouds.size() > 0) {
//                            response.sendRedirect("/public/"+clouds.get(0).getType()+"/compute?id=" + clouds.get(0).getId());
//                        }
//                    }
                    model.addAttribute("name", "service dashboard");

                    return "view/dashboard/public";

//                } catch (IOException e) {
//                    logger.error("Failed to redirecting service dashboard: '{}'", e.getMessage());
//                }
            }
        }

        return "index";
    }

//    @RequestMapping("/logout")
//    public String logOut(HttpServletRequest request,HttpServletResponse response) {
//
//        tokenService.removeCookie(request, response);
//        tokenService.removeRefreshCookie(request, response);
//        tokenService.removeSpringCookie(request, response);
//
//        tokenService.removeSession(request);
//
//        return "/";
//    }

    @RequestMapping(value = "/index/logo")
    public void getLogo(HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {

        InputStream in = null;
        String contentType = "application/octet-stream";

        in = getClass().getClassLoader().getResourceAsStream("static"+ File.separator+"images" +File.separator + "login" +File.separator + "logo.jpg");
        contentType = context.getMimeType("static"+File.separator+"images" +File.separator + "login" +File.separator + "logo.jpg");

        if(in != null) {
            response.setContentType(contentType);
            response.setContentLength(in.available());
            int length = -1;

            byte[] buffer = new byte[1024];

            while((length = in.read(buffer)) != -1) {
                response.getOutputStream().write(buffer, 0, length);
            }
            in.close();
        }
    }

    /**
     * @param session  HttpSession info
     * @param request  HttpServletRequest info
     * @param response HttpServletResponse info
     * @param map      Locale info (locale)
     * @return Map<String ,   Object>
     * @brief Locale Update
     */
    @RequestMapping(value = "/locale", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> setLocale(HttpServletRequest request, HttpSession session,
                                         HttpServletResponse response, @RequestBody Map<String, Object> map) {
        String locale = (String) map.get("locale");
        session.removeAttribute("configLocale");
        session.setAttribute("configLocale", locale);
        Locale locale2 = StringUtils.parseLocaleString(locale);

        if (locale.equals("ko") || locale.equals("en")) {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale2);
        } else {
            session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME,
                    request.getLocale());
        }

        return Collections.singletonMap("locale", locale);
    }

    /**
     * @param session  HttpSession info
     * @param request  HttpServletRequest info
     * @param response HttpServletResponse info
     * @brief Apply locale settings for the session by default ko
     */
    private void getLocale(HttpSession session, HttpServletRequest request,
                           HttpServletResponse response) {

        String config = "ko";

        try {

            config = cookieUtil.getName(request.getCookies(), "locale");
            if (config.equals("") || config.equals("null")) {
                config = "ko";
            }

        } catch (Exception e) {
            logger.error("Failed to get Locale : '{}'", e.getMessage());
        }

        Locale locale = request.getLocale();

        if (!config.equals("auto")) {
            locale = StringUtils.parseLocaleString(config);
        }

        session.setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale);
        session.removeAttribute("configLocale");
        session.setAttribute("configLocale", config);

        Cookie cookie = new Cookie("locale", config);
        response.addCookie(cookie);

    }

    @RequestMapping(value = "/logoutToken", method = RequestMethod.GET)
    public String logout(HttpSession session, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String token = (String) session.getAttribute(TokenService.COOKIE_IN_TOKEN_NAME);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth != null) {
            tokenService.logout(token, auth.getName());

//            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        return "redirect:/logout";
    }
}
