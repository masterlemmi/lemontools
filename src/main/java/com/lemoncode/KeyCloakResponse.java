package com.lemoncode;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
class KeyCloakResponse {
    @JsonProperty("access_token")
    String accessToken;
    @JsonProperty("refresh_token")
    String refreshToken;
    @JsonProperty("expires_in")
    int expiresIn;
    @JsonProperty("refresh_expires_in")
    int refreshExpiresIn;
    @JsonProperty("token_type")
    String tokenType;
    String scope;
}