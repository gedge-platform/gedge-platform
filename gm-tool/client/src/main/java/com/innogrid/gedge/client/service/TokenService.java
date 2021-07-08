package com.innogrid.gedge.client.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.innogrid.gedge.core.exception.GedgeplatformUnAuthorizedException;
import com.innogrid.gedge.core.model.UserInfo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;

@Service
public class TokenService {

	private static Logger logger = LoggerFactory.getLogger(TokenService.class);
	
	@Value("${authendpoint}")
	private String authEndpoint;
	@Value("${responsetype}")
	private String responseType;
	@Value("${redirecturi}")
	private String redirectUri;
	@Value("${clientid}")
	private String clientId;
	@Value("${tokenendpoint}")
	private String tokenEndpoint;
	@Value("${logoutendpoint}")
	private String logoutEndpoint;
	@Value("${clientsecret}")
	private String clientSecret;
	@Value("${granttype.auth}")
	private String grantAuthorizationCode;
	@Value("${granttype.client}")
	private String grantClientCredentials;
	@Value("${granttype.password}")
	private String grantPasswordCredentials;
	@Value("${granttype.refresh}")
	private String grantRefreshToken;
	@Value("${userid}")
	private String userId;
	@Value("${userpassword}")
	private String userPassword;
	@Value("${publickeyendpoint}")
	private String publicKeyEndPoint;
	@Value("${getinfoendpoint}")
	private String getInfoUri;
	private OkHttpClient client = new OkHttpClient();
	public static final String COOKIE_IN_TOKEN_NAME = "chaut";
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-13
	 * @param : HttpServletRequest
	 * @return : auth코드 요청을위한 uri 반환
	 */
	public String getAuthCode(HttpServletRequest request) {
		
		String state = sha256Encoder(request);
		String urlParam = "?response_type=" + responseType + "&redirect_uri=" + redirectUri + "&client_id=" + clientId + "&state=" + state + "";
		String apiUri = authEndpoint + urlParam;

		return apiUri;
	}

	/**
	 * @Author : jungyun
	 * @Date : 2019-08-13
	 * @param :HttpServletRequest
	 * @return : accessToken 반환
	 */
	public String getTokenByAuthorizationCode(String code) {
		
		JsonObject object = new JsonObject();
		
		object.addProperty("grant_type", grantAuthorizationCode);
		object.addProperty("client_id", clientId);
		object.addProperty("client_secret", clientSecret);
		object.addProperty("redirect_uri", redirectUri);
		object.addProperty("code", code);
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),object.toString());
		Request okRequest = new Request.Builder().url(tokenEndpoint).post(requestBody).build();
		Response response = null;
		String resMessage = "";

		try {
			response = client.newCall(okRequest).execute();
			resMessage = response.body().string();

			JsonParser parser = new JsonParser();

			if(resMessage!=null) {
				JsonObject message = parser.parse(resMessage).getAsJsonObject();
				if (message.get("error") != null) {
					String error = message.get("error").getAsString();
					String errorDetail = message.get("error_description").getAsString();

					throw new GedgeplatformUnAuthorizedException(error, errorDetail);
				}
			}

		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		} finally {
		}

		if(response.isSuccessful()) {
			return resMessage;
		}else {
			return null;
		}
	}

	/**
	 * @Author : jungyun
	 * @Date : 2019-08-13
	 * @param :
	 * @return : ClientCredentials 방식 토큰 반환
	 */
	public String getTokenByClientCredentials() {
		
		String clientCredentials = clientId+":"+clientSecret;
		String apiheader = "Basic "+ Base64Utils.encodeToString(clientCredentials.getBytes());
		JsonObject object = new JsonObject();
		
		object.addProperty("grant_type", grantClientCredentials);
		
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),object.toString());
		Request okRequest = new Request.Builder().url(tokenEndpoint).addHeader("Authorization", apiheader).post(requestBody).build();
		Response response = null;
		String resMessage = "";
		
		try {
			response = client.newCall(okRequest).execute();
			resMessage = response.body().string();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		}finally {
		}

		if(response.isSuccessful()) {
			return resMessage;
		}else {
			return null;
		}
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-13
	 * @param :
	 * @return : PasswordCredentials 방식 토큰 반환
	 */
	public String getTokenByPasswordCredentials() {
		
		String passwordCredentials = clientId+":"+clientSecret;
		String apiheader = "Basic "+ Base64Utils.encodeToString(passwordCredentials.getBytes());
		JsonObject object = new JsonObject();
		
		object.addProperty("grant_type", grantPasswordCredentials);
		object.addProperty("username", userId);
		object.addProperty("password", userPassword);
		
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),object.toString());
		Request okRequest = new Request.Builder().url(tokenEndpoint).addHeader("Authorization", apiheader).post(requestBody).build();
		Response response = null;
		String resMessage = "";
		
		try {
			response = client.newCall(okRequest).execute();
			resMessage = response.body().string();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		}finally {
		}

		if(response.isSuccessful()) {
			return resMessage;
		}else {
			return null;
		}
	}
	
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-13
	 * @param :HttpServletRequest
	 * @return : SHA-256으로 암호화된 sessionid 반환
	 */
	private String sha256Encoder(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		String sessionId = session.getId();
		StringBuffer state = null;
		String encodingType = "SHA-256";

		try {
			MessageDigest digest = MessageDigest.getInstance(encodingType);
			byte[] hash = digest.digest(sessionId.getBytes("UTF-8"));
			state = new StringBuffer();
			for (int i = 0; i < hash.length; i++) {
				String hex = Integer.toHexString(0xff & hash[i]);
				if (hex.length() == 1)state.append('0');
				state.append(hex);
			}
		} catch (NoSuchAlgorithmException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		} finally {
		}

		return state.toString();
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-21
	 * @param : HttpServletRequest 
	 * @return : String token 쿠키에서 토큰을 파싱해 반환
	 */
	public String getTokenFromCookie(HttpServletRequest request) {
		
		Cookie[] cookies = request.getCookies();
		String token = null;
		
		if(cookies!=null) {
			for(Cookie itr:cookies) {
				if(itr.getName().equals(COOKIE_IN_TOKEN_NAME)) {
					token = itr.getValue();
					break;
				}
			}
		}
		
		return token;
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-21
	 * @param : String (토큰요청api 콜 응답값)
	 * @return : Cookie 생성및 설정후 반환 
	 */
	public Cookie cookieAddTokenByString(HttpServletResponse response, String tokenResponse) {

		Cookie cookie = null;
		
		if(tokenResponse!=null) {
			cookie = new Cookie(COOKIE_IN_TOKEN_NAME, tokenResponse);
			
			cookie.setHttpOnly(true);
			cookie.setSecure(false);
			//cookie.setDomain("192.168.123.140:8083/");
			cookie.setMaxAge(60*60*24);
			response.addCookie(cookie);	
		}
		
		return cookie;
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-21
	 * @param : String (토큰요청api 콜 응답값)
	 * @return : Cookie 생성및 설정후 반환 
	 */
	public void cookieAddTokenByJson(HttpServletResponse response, String tokenResponse) {
		
		JsonParser parser = new JsonParser();

		if(tokenResponse!=null) {
			JsonObject token = parser.parse(tokenResponse).getAsJsonObject();
			Cookie cookie = new Cookie(COOKIE_IN_TOKEN_NAME, token.get("access_token").getAsString());
			
			cookie.setHttpOnly(true);
			cookie.setSecure(false);
			//cookie.setDomain("192.168.123.140:8083/");
			cookie.setMaxAge(60*60*24);
			response.addCookie(cookie);

			Cookie cookie2 = new Cookie("refresh_token", token.get("refresh_token").getAsString());

			cookie2.setHttpOnly(true);
			cookie2.setSecure(false);
			//cookie.setDomain("192.168.123.140:8083/");
			cookie2.setMaxAge(60*60*24*20);
			response.addCookie(cookie2);
		}
	}

	public void cookieAddToken(HttpServletResponse response, String token, String refreshToken) {
		Cookie cookie = new Cookie(COOKIE_IN_TOKEN_NAME, token);

		cookie.setHttpOnly(true);
		cookie.setSecure(false);
		//cookie.setDomain("192.168.123.140:8083/");
		cookie.setMaxAge(60*60*24);
		response.addCookie(cookie);

		Cookie cookie2 = new Cookie("refresh_token", refreshToken);

		cookie2.setHttpOnly(true);
		cookie2.setSecure(false);
		//cookie.setDomain("192.168.123.140:8083/");
		cookie2.setMaxAge(60*60*24*20);
		response.addCookie(cookie2);
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-21
	 * @param : HttpServletRequest HttpServletResponse 
	 * @return : 
	 */
	public void removeCookie(HttpServletRequest request, HttpServletResponse response) {

		Cookie cookie = new Cookie(COOKIE_IN_TOKEN_NAME, null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}
	public void removeRefreshCookie(HttpServletRequest request, HttpServletResponse response) {

		Cookie cookie = new Cookie("refresh_token", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}

	public void removeSpringCookie(HttpServletRequest request, HttpServletResponse response) {
		Cookie cookie = new Cookie("JSESSIONID", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-21
	 * @param : HttpServletRequest  
	 * @return : 
	 */
	public void removeSession(HttpServletRequest request) {
		
		HttpSession session = request.getSession(false);
		if(session != null) {
			session.removeAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
			session.invalidate();
		}
		SecurityContextHolder.clearContext();
	}
	
//	/**
//	 * @Author : jungyun
//	 * @Date : 2019-08-21
//	 * @param : String ,HttpServletRequest
//	 * @return :
//	 */
//	public void createTokenSession(String tokenResponse, HttpServletRequest request) {
//
//		HttpSession session = request.getSession();
//
//		if(tokenResponse!=null) {
//			session.setAttribute("token", tokenResponse);
//		}
//	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-23
	 * @param : String 
	 * @return : 토큰발급api 응답값을 받아 access-token 분리 후 응답
	 */
	public String getTokenFromResponse(String tokenResponse) {
		
		JsonParser parser = new JsonParser();
		String token=null;
		
		if(tokenResponse!=null) {
			JsonObject tokenJsonObject = parser.parse(tokenResponse).getAsJsonObject(); 	
			String target = "access_token";
			token = tokenJsonObject.get(target).getAsString();
		}
		
		return token;
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-23
	 * @param : 
	 * @return : api콜 응답값(공개키)
	 */
	public String getPublicKey() {

		OkHttpClient client = new OkHttpClient();
		Request request = new Request.Builder().url(publicKeyEndPoint).get().build();
		String resMessage = "";
		
		try {
			Response response = client.newCall(request).execute();
			resMessage = response.body().string();
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		}

		return resMessage;
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-23
	 * @param : String publicKeyResponse,String token
	 * @return : 토큰 검증후 true/false
	 */
	public boolean ValidateToken(String publicKeyResponse, String token, HttpServletRequest request, HttpServletResponse response) throws NoSuchAlgorithmException, InvalidKeySpecException, UnsupportedEncodingException {

		KeyFactory kf = KeyFactory.getInstance("RSA");
		JsonParser parser = new JsonParser();
		JsonObject publickey = parser.parse(publicKeyResponse).getAsJsonObject();

		String publicKeyContent = publickey.get("publickey").getAsString().replace("\\n", "").replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace("\"", "").replace("\n", "");
		X509EncodedKeySpec keySpecX509 = new X509EncodedKeySpec(Base64Utils.decodeFromString(publicKeyContent));
		PublicKey publicKey = kf.generatePublic(keySpecX509);

		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(publicKey).parseClaimsJws(token);
			if(claims.getBody().getExpiration().before(new Date())) {
				return callRefreshToken(request, response);
			}
			return true;
		} catch (ExpiredJwtException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
			return callRefreshToken(request, response);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
			return false;
		}finally {
		}
	}
	
	/**
	 * @Author : jungyun
	 * @Date : 2019-08-21
	 * @param : String token
	 * @return : 유저정보호출 api call 결과값
	 */
	public UserInfo callGetInfo(String token) {
		JsonParser parser = new JsonParser();

//		String userInfo = new String(java.util.Base64.getDecoder().decode(token.split("\\.")[1]));

		OkHttpClient client = new OkHttpClient();
//		Request request = new Request.Builder().url(getInfoUri+"/"+parser.parse(userInfo).getAsJsonObject().get("userId").getAsString()).get().addHeader("Authorization", "Bearer "+token).build();
		Request request = new Request.Builder().url(getInfoUri).get().addHeader("Authorization", "Bearer "+token).build();
		String resMessage;

		UserInfo info = new UserInfo();
		
		try {
			Response response = client.newCall(request).execute();
			resMessage = response.body().string();

			JsonObject getRefreshToken = parser.parse(resMessage).getAsJsonObject();
			if(getRefreshToken.get("userId")!=null){
				info.setNewId(getRefreshToken.get("userId").getAsString());
			}
			if(getRefreshToken.get("name")!=null){
				info.setName(getRefreshToken.get("name").getAsString());
			}
			if(getRefreshToken.get("phone")!=null){
				info.setContract(getRefreshToken.get("phone").getAsString());
			}
			if(getRefreshToken.get("email")!=null){
				info.setEmail(getRefreshToken.get("email").getAsString());
			}
			info.setGroupId("");
			info.setPassword("");
			info.setEnabled(true);
			//{"users_pk":"Hw5VpegwHwsYQ3EO","user_id":"gedgeplatform07","nickname":"test7","name":"test","birthday":"880515","age":"30","gender":"m","phone":"01012341234","email":"test@test.com","email_verify":false,"role":"ma","user_state":"A"}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		}
		
		return info;
	}
	
//	/**
//	 * @Author : jungyun
//	 * @Date : 2019-08-29
//	 * @param : HttpServletRequest
//	 * @return : session에서 refreshToken 분리해서 리턴
//	 */
//	public String getRefreshTokenFromSession(HttpServletRequest request) {
//
//		String token = (String) request.getSession().getAttribute("token");
//		String refreshToken = null;
//		JsonParser parser = new JsonParser();
//
//		if(token!=null) {
//			JsonObject getRefreshToken = parser.parse(token).getAsJsonObject();
//			String target = "refresh_token";
//			if(getRefreshToken.get(target)!=null){
//				refreshToken = getRefreshToken.get(target).getAsString();
//			}
//		}
//
//		return refreshToken;
//	}

	public String getRefreshTokenFromCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		String token = null;

		if(cookies!=null) {
			for(Cookie itr:cookies) {
				if(itr.getName().equals("refresh_token")) {
					token = itr.getValue();
					break;
				}
			}
		}

		return token;
	}

	/**
	 * @Author : jungyun
	 * @Date : 2019-08-29
	 * @param : HttpServletRequest,HttpServletResponse
	 * @return : token발급 성공시true 실패시 false
	 */
	public boolean callRefreshToken(HttpServletRequest request, HttpServletResponse response) {

		String base64IdPw = clientId+":"+clientSecret;
		String refreshHeader = "Basic "+ Base64Utils.encodeToString(base64IdPw.getBytes());
		String refreshToken = null;
		HttpSession session = request.getSession(true);

		if(session != null) {
			refreshToken = (String)session.getAttribute("refresh_token");
		}

		if(refreshToken == null)getRefreshTokenFromCookie(request);
		JsonObject object = new JsonObject();

		if(refreshToken==null) return false;
			
		object.addProperty("grant_type", grantRefreshToken);
		object.addProperty("refresh_token", refreshToken);
		
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"),object.toString());
		Request okRequest = new Request.Builder().url(tokenEndpoint).addHeader("Authorization",refreshHeader).post(requestBody).build();
		Response okResponse = null;
		String resMessage = "";

		try {
			okResponse = client.newCall(okRequest).execute();
			resMessage = okResponse.body().string();
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			e.printStackTrace();
		}finally {
		}
		
		System.out.println("리프레시 토큰 값 : "+refreshToken);
		System.out.println("리프레시 토큰 응답 : "+resMessage);
		if(okResponse.isSuccessful()) {
			JsonParser parser = new JsonParser();
			if(resMessage!=null) {
				JsonObject token = parser.parse(resMessage).getAsJsonObject();
				session.setAttribute(TokenService.COOKIE_IN_TOKEN_NAME, token.get("access_token").getAsString());
				session.setAttribute("refreshToken", refreshToken);
			}

			cookieAddTokenByJson(response, resMessage);
			return true;
		}else {
			return false;
		}
	}

	public Boolean logout(String token, String userId) {

		JsonParser parser = new JsonParser();

		JsonObject object = new JsonObject();

		object.addProperty("userId", userId);
		RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),object.toString());
		Request okRequest = new Request.Builder().url(logoutEndpoint).post(requestBody).addHeader("Authorization", "Bearer "+token).build();
		Response response;
		String resMessage;

		try {
			response = client.newCall(okRequest).execute();
			resMessage = response.body().string();

			JsonObject resultResponse = parser.parse(resMessage).getAsJsonObject();

			String result = resultResponse.get("result").getAsString();

			if(result.equals("success")) {
				return true;
			}
		} catch (IOException e) {

		}

		return false;
	}
}
