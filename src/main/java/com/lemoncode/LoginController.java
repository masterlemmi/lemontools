package com.lemoncode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
public class LoginController {

    @Autowired
    ResourceProperties props;

    RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/users/authenticate")
    public UserInfo login(@RequestBody Credentials data) {

        RestTemplate restTemplate = new RestTemplate();
        String url = props.getAuthServer() + "/token";

        HttpHeaders headers = new HttpHeaders();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

        map.add("client_id", props.getClientId());
        map.add("client_secret", props.getClientSecret());
        map.add("username", data.getUsername());
        map.add("password", data.getPassword());
        map.add("grant_type", "password");
        map.add("scope", "read write");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);

        KeyCloakResponse keyCloak = null;
        try {
            ResponseEntity<KeyCloakResponse> response = restTemplate.postForEntity(url, request, KeyCloakResponse.class, map);
            keyCloak = response.getBody();
        } catch (Exception e) {
            System.out.println("----> Error validating credentials " + e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid Credentials", e);
        }

        if (keyCloak == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid Credentials");
        }

        UserInfo userInfo = new UserInfo();
        userInfo.setToken(keyCloak.getAccessToken());
        userInfo.setUsername(data.getUsername());
        return userInfo;

    }


    @GetMapping("/resources")
    public ResponseEntity<List<Resource>> getResources(@RequestHeader("authorization") String token) {

        List<Resource> res = props.getResources();

        for (Resource r : res) {
            String response = getHealth(r.getHealthUrl(), token.replaceAll("Bearer ", ""));
            String health = response.contains("UP") ? "UP" : "DOWN";
            r.setHealth(health);
        }

        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES)).body(res);

    }

    private String getHealth(String url, String token) {

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.setBearerAuth(token);

            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();


        } catch (Exception e) {
            if (e instanceof HttpClientErrorException) {
                HttpClientErrorException casted = (HttpClientErrorException) e;
                if (casted.getRawStatusCode() == 401)
                    throw new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "Not Authorized");
            }
            e.printStackTrace();

        }

        return "";
    }

}
