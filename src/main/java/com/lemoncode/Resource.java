package com.lemoncode;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
class Resource {
    String name;
    String alias;
    String server;
    String healthUrl;
    String health;
    String route;
}