package com.lemoncode.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;

@Component
public class KeyCloakAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private TokenService tokenService;

    private @Autowired
    HttpServletRequest request;


    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        try {
            //save tokens for resource use
            // TODO: this is executed at every login. access tokens are always requested and replaced. .. find better design
            TokenResponse keyCloak = tokenService.requestAccessToken(authentication, request.getParameter("otp"));

            if (keyCloak == null) throw new BadCredentialsException("Bad Credentials");

            tokenService.saveToken(keyCloak, authentication.getName());

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    authentication.getName(), "", Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));

            SecurityContextHolder.getContext().setAuthentication(auth);

            return auth;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BadCredentialsException("Invalid Credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}