package com.innogrid.gedge.apiopenstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@EnableWebMvc
@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = "com.innogrid.gedge", exclude = DataSourceAutoConfiguration.class)
public class ApiEdgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiEdgeApplication.class, args);
    }

}
