package com.innogrid.gedge.coredb.service;

import com.innogrid.gedge.core.model.UserInfo;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AuthService extends UserDetailsService {
    public UserInfo getUserInfo(String id);
}
