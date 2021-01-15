package com.lemoncode;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
class UserInfo {
    String id;
    String username;
    String firstName;
    String lastName;
    String token;
}
