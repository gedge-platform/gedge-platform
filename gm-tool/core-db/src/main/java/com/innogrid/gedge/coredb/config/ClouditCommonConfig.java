package com.innogrid.gedge.coredb.config;

import com.innogrid.gedge.core.util.AES256Util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.UnsupportedEncodingException;

@Configuration
public class ClouditCommonConfig {

	@Bean
	public AES256Util getAES256Util(@Value("${gedgeit.encrypt.key}") String key) throws UnsupportedEncodingException {
		AES256Util util = new AES256Util();
		util.setKey(key);

		return util;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		PasswordEncoder pe = PasswordEncoderFactories.createDelegatingPasswordEncoder();

		return pe;
	}
}
