package com.innogrid.gedge.client.controller;

import com.innogrid.gedge.client.exception.ValidationFailException;
import com.innogrid.gedge.client.service.ApiService;
import com.innogrid.gedge.client.service.TokenService;
import com.innogrid.gedge.client.util.CommonUtil;
import com.innogrid.gedge.client.util.Pagination;
import com.innogrid.gedge.core.model.CredentialInfo;
import com.innogrid.gedge.core.model.UserInfo;
import com.innogrid.gedge.coredb.service.CredentialService;
import com.innogrid.gedge.coredb.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wss on 19. 3. 22.
 */
@Controller
@RequestMapping("/environments")
public class CredentialController {

    private static Logger logger = LoggerFactory.getLogger(CredentialController.class);

    @Autowired
    private CredentialService credentialService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ApiService apiService;

    @Secured({"ROLE_CREDENTIAL_READ", "ROLE_CREDENTIAL_WRITE"})
    @RequestMapping(value = {"", "/credential"}, method = RequestMethod.GET)
    public String getCredential(HttpServletRequest request, Principal principal, HttpSession session, Model model) {

        model.addAttribute("name", "credentials");

        return "view/credential";
    }

    @Secured({"ROLE_CREDENTIAL_READ", "ROLE_CREDENTIAL_WRITE"})
    @RequestMapping(value = "/credentials", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getCredentials(
                                   @RequestParam(required=false) Integer page,
                                   @RequestParam(required=false) Integer rows,
                                   @RequestParam(defaultValue="name") String sidx,
                                   @RequestParam(defaultValue="asc") String sord,
                                   @RequestParam(required = false) String q0,
                                   @RequestParam(required = false) String q1) {

        Map<String, Object> params = new HashMap<String, Object>();

        params.put("sidx", sidx);
        params.put("sord", sord);
        params.put("q0", StringUtils.trimWhitespace(q0));
        params.put("q1", StringUtils.trimWhitespace(q1));
        params.put("page", page);
        params.put("rows", rows);

        return Pagination.getPagination(page, credentialService.getTotal(params), rows, credentialService.getCredentials(params));
    }

    @Secured({"ROLE_CREDENTIAL_WRITE"})
    @RequestMapping(value = "/credentials/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @ResponseBody
    public void deleteCredential(@PathVariable String id, HttpSession session) {
        UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");

        Map<String, Object> params = new HashMap<>();
        params.put("id", id);

        CredentialInfo info = credentialService.getCredentialInfo(params);

        credentialService.deleteCredential(info, userInfo);

        CommonUtil.setSessionCloudList(session, credentialService, projectService);
    }

    @Secured({"ROLE_CREDENTIAL_WRITE"})
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/credentials", method = RequestMethod.POST)
    public @ResponseBody
    CredentialInfo createCredential(@RequestBody CredentialInfo info, HttpSession session) throws Exception {
        UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
        String token = (String) session.getAttribute(TokenService.COOKIE_IN_TOKEN_NAME);

        boolean isValid = apiService.validateCredential(info, token);
        if(isValid) {
            CredentialInfo result = credentialService.createCredential(info, userInfo);
            CommonUtil.setSessionCloudList(session, credentialService, projectService);
            return result;
        } else {
            throw new ValidationFailException("유효하지 않은 credential 정보 입니다.");
        }
    }

    @Secured({"ROLE_CREDENTIAL_WRITE"})
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/credentials/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    CredentialInfo updateCredential(HttpSession session, @RequestBody CredentialInfo info, @PathVariable("id") String id) throws Exception {
        UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
        String token = (String) session.getAttribute(TokenService.COOKIE_IN_TOKEN_NAME);

        boolean isValid = apiService.validateCredential(info, token);
        if(isValid) {
            CredentialInfo result = credentialService.updateCredential(info, userInfo);
            CommonUtil.setSessionCloudList(session, credentialService, projectService);
            return result;
        } else {
            throw new ValidationFailException("유효하지 않은 credential 정보 입니다.");
        }
    }

    @Secured({"ROLE_GROUP_WRITE"})
    @RequestMapping(value = "/credentials/projects", method = RequestMethod.GET)
    @ResponseBody
    public List<CredentialInfo> getCredentials(HttpSession session) {
        String token = (String) session.getAttribute(TokenService.COOKIE_IN_TOKEN_NAME);

        return apiService.getCredentialsProject(credentialService.getCredentials(new HashMap<>()), token);
    }

    @RequestMapping(value = "/credentials/names", method = RequestMethod.GET)
    @ResponseBody
    public List<CredentialInfo> getCredentialsName() {
        return credentialService.getCredentials(new HashMap<String, Object>(){{
            put("nameOnly", true);
        }});
    }
}
