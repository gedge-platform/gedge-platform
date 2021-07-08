package com.innogrid.gedge.coreedge.model;

import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.jackson.JacksonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * @author ksh1006@innogrid.com
 * @date  2020-05-26
 * @brief RESTful API 구현을 위한 추상클래스
 * @details
 */
public abstract class RestApiAbstract {
  Logger logger = LoggerFactory.getLogger(RestApiAbstract.class);

  private String useToken;

  static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
  public static final JsonFactory JSON_FACTORY = new JacksonFactory();

  protected static final String NODE_TOTAL = "http://192.168.100.42:18000/kube/nodes/gedge/api/v1/nodes";
  protected static final String NODE_MASTER = "http://192.168.100.42:18000/kube/nodes/gedge/api/v1/nodes?labelSelector=node-role.kubernetes.io/master";
  protected static final String PODS = "http://192.168.100.42:18000/default/gedge/api/v1/pods";
  protected static final String GET_EDGE = "http://192.168.100.42:18000/edges";
  protected static final String NODE_USAGE = "http://129.254.202.123:18080/kube/apis/metrics.k8s.io/v1beta1/nodes";

  protected HttpRequestFactory jsonRequestFactory;

  protected HttpRequestFactory httpRequestFactory;

  public void receiveToken(String tokenValue) {
    this.useToken = tokenValue;
    logger.error("Receive Token is : {} ", useToken);
  }

  public RestApiAbstract(){
    jsonRequestFactory = HTTP_TRANSPORT.createRequestFactory(new HttpRequestInitializer() {
      @Override
      public void initialize(HttpRequest httpRequest) throws IOException {
        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.set("X-Auth-Token", "47bb6e23f67e4ef794e8c6bcd6b5fe30");
        httpHeaders.set("X-Auth-Token", useToken);
        httpRequest.setParser(new JsonObjectParser(JSON_FACTORY));
        httpRequest.setHeaders(httpHeaders);
      }
    });

    httpRequestFactory = HTTP_TRANSPORT.createRequestFactory(new HttpRequestInitializer() {
      @Override
      public void initialize(HttpRequest httpRequest) throws IOException {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Auth-Token", "8c302cda5fd046369169fc25674a419b");
        httpHeaders.setContentType("application/x-www-form-urlencoded");
        httpHeaders.setCacheControl("no-cache");

        httpRequest.setParser(new UrlEncodedParser());
        httpRequest.setHeaders(httpHeaders);
      }
    });

  }
}