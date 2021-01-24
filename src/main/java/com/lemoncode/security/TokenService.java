package com.lemoncode.security;

import com.lemoncode.resource.ResourceProperties;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class TokenService {

    @Autowired
    TokenRepository repository;

    @Autowired
    ResourceProperties props;

    @Autowired
    RestTemplate restTemplate;

    public Token saveToken(@NonNull TokenResponse resp, @NonNull String username) {
        Token token = new Token();
        token.setAccessToken(resp.getAccessToken());
        token.setRefreshToken(resp.getRefreshToken());
        token.setScope(resp.getScope());
        token.setUsername(username);
        LocalDateTime tokenExpire = LocalDateTime.now().plusSeconds(resp.getExpiresIn());
        LocalDateTime refreshExpire = LocalDateTime.now().plusSeconds(resp.getRefreshExpiresIn());
        token.setTokenExpiration(tokenExpire);
        token.setRefreshExpiration(refreshExpire);
        return repository.save(token);
    }

    //from keycloak

    public TokenResponse requestAccessToken(Authentication authentication, String otp) {
        String name = authentication.getName();
        String password = authentication.getCredentials().toString();

        String url = props.getAuthServer() + "/token";

        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

        map.add("client_id", props.getClientId());
        map.add("client_secret", props.getClientSecret());
        map.add("username", name);
        map.add("password", password);
        map.add("grant_type", "password");
        map.add("scope", "read write");
        map.add("totp", otp);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(url, request, TokenResponse.class, map);
        return response.getBody();
    }

    //from dB
    public String getAccessToken(String username) {
        Token token = repository.findById(username).orElse(null);

        if (token == null || token.isRefreshTokenExpired()) {
            throw new RuntimeException("no token or expired");
        }

        if (token.isAccessTokenExpired()) {
            TokenResponse response = refreshAccessToken(token.getRefreshToken());
            Token savedToken = saveToken(response, username);
            return savedToken.getAccessToken();
        }

        return token.getAccessToken();
    }

    TokenResponse refreshAccessToken(String refreshToken) {
        String url = props.getAuthServer() + "/token";

        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

        map.add("client_id", props.getClientId());
        map.add("client_secret", props.getClientSecret());
        map.add("grant_type", "refresh_token");
        map.add("refresh_token", refreshToken);


        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        TokenResponse tokenResponse;
        try {
            ResponseEntity<TokenResponse> response = restTemplate.postForEntity(url, request, TokenResponse.class, map);
            tokenResponse = response.getBody();
        } catch (Exception e) {
            System.out.println("----> Error validating credentials " + e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid Credentials", e);
        }

        if (tokenResponse == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid Credentials");
        }

        return tokenResponse;
    }

    public void revokeAccessToken(String username) {
        try {
            Token token = repository.findById(username).orElse(null);

            if (token == null){
                System.out.println("Not in system, can't logout");
                return;
            }

            String url = props.getAuthServer() + "/logout";

            HttpHeaders headers = new HttpHeaders();
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

            map.add("client_id", props.getClientId());
            map.add("client_secret", props.getClientSecret());
            map.add("refresh_token", token.getRefreshToken());


            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class, map);
            String body = response.getBody();
            System.out.println("RESPONSE" + body);
        } catch (Exception e) {
            System.out.println("----> Error revoking access token " + e.getMessage());
            e.printStackTrace();
        }
    }
}
