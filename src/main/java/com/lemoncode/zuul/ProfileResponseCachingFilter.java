package com.lemoncode.zuul;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.CharStreams;
import com.lemoncode.resource.CacheService;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ProfileResponseCachingFilter extends ZuulFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final ObjectMapper mapper = new ObjectMapper();
    private static final Pattern PROFILE_RESOURCE = Pattern.compile(".*/api/people/\\d+");

    @Autowired
    CacheService cacheService;

    @Override
    public Object run() {
        final RequestContext ctx = RequestContext.getCurrentContext();

        RequestContext context = RequestContext.getCurrentContext();
        try (final InputStream responseDataStream = context.getResponseDataStream()) {

            if (responseDataStream == null) {
                logger.info("BODY: {}", "");
                return null;
            }

            String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String responseData = CharStreams.toString(new InputStreamReader(responseDataStream, "UTF-8"));
            cacheService.saveToCache(username, responseData);
            logger.info("BODY: {}", responseData);

            context.setResponseBody(responseData);
        } catch (Exception e) {
            logger.error("Error occured in zuul post filter", e);
        }

        return null;
    }

    @Override
    public boolean shouldFilter() {
        boolean shouldfilter = false;
        final RequestContext ctx = RequestContext.getCurrentContext();
        String URI = ctx.getRequest().getRequestURI();

        Matcher matcher = PROFILE_RESOURCE.matcher(URI);

        return matcher.matches();
    }

    @Override
    public int filterOrder() {
        return 10;
    }

    @Override
    public String filterType() {
        return "post";
    }

}
