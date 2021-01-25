package com.lemoncode.zuul;

import com.lemoncode.security.TokenService;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CustomPreZuulFilter extends ZuulFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    TokenService tokenService;


    @Override
    public Object run() {
        final RequestContext ctx = RequestContext.getCurrentContext();
        logger.info("in zuul filter URI:" + ctx.getRequest().getRequestURI());

        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String accessToken = tokenService.getAccessToken(username);

        ctx.addZuulRequestHeader("Authorization", "Bearer " + accessToken);

        return null;
    }


    @Override
    public boolean shouldFilter() {

        final RequestContext ctx = RequestContext.getCurrentContext();
        String URI = ctx.getRequest().getRequestURI();

        return URI.contains("api/manga") || URI.contains("api/people");
    }

    @Override
    public int filterOrder() {
        return FilterConstants.PRE_DECORATION_FILTER_ORDER + 1;
    }

    @Override
    public String filterType() {
        return "pre";
    }

}
