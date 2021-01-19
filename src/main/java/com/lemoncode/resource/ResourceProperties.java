package com.lemoncode.resource;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties
@Getter
@Setter
public class ResourceProperties {

    private String corsPaths;
    private String clientId;
    private String authServer;
    private String clientSecret;
    private List<Resource> resources;
}