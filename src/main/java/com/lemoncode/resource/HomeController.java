package com.lemoncode.resource;

import com.lemoncode.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
public class HomeController {

    @Autowired
    ResourceProperties props;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    TokenService tokenService;

    @RequestMapping("/user")
    public Principal user(Principal user) {

        return user;
    }


    @GetMapping("/resources")
    public ResponseEntity<List<Resource>> getResources() {

        List<Resource> res = props.getResources();

        for (Resource r : res) {
            String response = getHealth(r.getHealthUrl());
            String health = response.contains("UP") ? "UP" : "DOWN";
            r.setHealth(health);
        }

        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES)).body(res);

    }

    private String getHealth(String url) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String accessToken = tokenService.getAccessToken(username);


        try {
            System.out.println("----> GETTING HEATLH from " + url);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>("", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            System.out.println("---------> RESP: " + response.getBody());

            return response.getBody();


        } catch (Exception e) {
            if (e instanceof HttpClientErrorException) {
                HttpClientErrorException casted = (HttpClientErrorException) e;
                if (casted.getRawStatusCode() == 401)
                    throw new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "Not Authorized");
            }

            System.out.println("ERRORRR---> " + e.getMessage());
            e.printStackTrace();

        }

        return "";
    }

}
