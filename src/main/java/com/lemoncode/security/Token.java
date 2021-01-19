package com.lemoncode.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Token {
    @Id
    @EqualsAndHashCode.Include
    private String username;
    @Column(length=2000)
    private String accessToken;
    @Column(length=2000)
    private String refreshToken;
    private LocalDateTime tokenExpiration;
    private LocalDateTime refreshExpiration;
    private String scope;

    public boolean isAccessTokenExpired(){
        return LocalDateTime.now().isAfter(tokenExpiration);
    }

    public boolean isRefreshTokenExpired(){
        return LocalDateTime.now().isAfter(refreshExpiration);

    }
}
