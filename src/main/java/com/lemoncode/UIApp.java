package com.lemoncode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy
public class UIApp  {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(UIApp.class, args);
    }
    
}
