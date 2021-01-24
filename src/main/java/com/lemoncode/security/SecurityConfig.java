package com.lemoncode.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private KeyCloakAuthenticationProvider authProvider;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception { //@formatter:off
        http.requiresChannel()
                .requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
                .requiresSecure()
            .and()
                .logout()
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
            .and()
                .csrf()
                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .ignoringAntMatchers("/login", "/logout", "/users/authenticate")
            .and()
                .cors()
            .and()
                .authorizeRequests()
                    .antMatchers("/index.html", "/", "/home", "/login", "/*.css", "/*.js")
                        .permitAll()
                    .anyRequest()
                        .authenticated()
             .and()
                .httpBasic()
             .and()
                .rememberMe().key("uniqueAndSecret");

    }//@formatter:on

//    @Override
//    protected void configure(HttpSecurity http) throws Exception {// @formatter:off
//        http.csrf().disable().authorizeRequests().anyRequest().permitAll();
//    }


}