package com.innogrid.gedge.client.config;

import com.innogrid.gedge.client.handler.AuthenticationFailureHandler;
import com.innogrid.gedge.client.handler.AuthenticationSuccessHandler;
import com.innogrid.gedge.coredb.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Bean
	public AuthenticationSuccessHandler getSuccessHandler() {
		return new AuthenticationSuccessHandler();
	}

	@Bean
	public AuthenticationFailureHandler getFailureHandler() {
		return new AuthenticationFailureHandler();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.authorizeRequests()
				.antMatchers("/", "/index", "/index/logo", "/login", "/api/**", "/actuator/**").permitAll()
				.anyRequest().authenticated()
				.and()
			.formLogin()
				.loginPage("/login")
				.successHandler(getSuccessHandler())
                .failureHandler(getFailureHandler())
				.permitAll()
				.and()
			.logout()
				.logoutUrl("/logout")
//                .logoutSuccessHandler(getLogoutSuccessHandler())
				.invalidateHttpSession(false)
				.permitAll()
                .and()
            .sessionManagement()
                .invalidSessionUrl("/login?error=sessionExpired");
//
//		http.csrf().disable();

//		http.authorizeRequests()
//				.antMatchers("/login", "/oauth2/**")
//				.permitAll()
//				.anyRequest().authenticated()
//				.and()
//				.oauth2Login()
//				.loginPage("/login")
//				.successHandler(getSuccessHandler())
//				.failureHandler(getFailureHandler())
//				.and()
//				.sessionManagement()
//				.invalidSessionUrl("/login?error=sessionExpired");

//		http.authorizeRequests()
//				.anyRequest().permitAll()
//				.and()
//				.logout()
//				.logoutUrl("/logout")
//				.logoutSuccessUrl("/")
//				.deleteCookies("refresh_token")
//				.deleteCookies("JSESSIONID")
//				.deleteCookies(TokenService.COOKIE_IN_TOKEN_NAME)
//				.invalidateHttpSession(true);

		http.csrf().disable();
	}

//	@Bean
//	public ClientRegistrationRepository clientRegistrationRepository(
//		@Value("${spring.security.oauth2.client.registration.city-hub.client-id}") String clientId,
//		@Value("${spring.security.oauth2.client.registration.city-hub.client-secret}") String clientSecret
//	) {
//		List<ClientRegistration> registrationList = new ArrayList<>();
//		registrationList.add(CustomOAuth2Provider.CITY_HUB.getBuilder("city-hub")
//		.clientId(clientId)
//		.clientSecret(clientSecret)
//		.jwkSetUri("temp")
//		.build());
//
//		return new InMemoryClientRegistrationRepository(registrationList);
//	}

	@Autowired
    PasswordEncoder passwordEncoder;

	@Autowired
	private AuthService userAuthService;

	@Autowired
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userAuthService).passwordEncoder(passwordEncoder);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring()
			.antMatchers("/i18n/**")
			.antMatchers("/static/**")
			.antMatchers("/css/**")
			.antMatchers("/js/**")
			.antMatchers("/images/**");
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
}
