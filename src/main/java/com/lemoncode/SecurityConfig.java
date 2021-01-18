package com.lemoncode;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {// @formatter:off
        http.requiresChannel()
                .requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
                .requiresSecure()
            .and()
                .csrf()
                .ignoringAntMatchers ("/login","/logout", "/users/authenticate")
                .and()
                .cors()
            .and()
              .authorizeRequests()
                .anyRequest()
                  .permitAll();

    }//@formatter:on

//    @Override
//    protected void configure(HttpSecurity http) throws Exception {// @formatter:off
//        http.csrf().disable().authorizeRequests().anyRequest().permitAll();
//    }


}