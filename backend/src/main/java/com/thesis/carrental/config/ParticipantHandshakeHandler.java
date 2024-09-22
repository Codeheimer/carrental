package com.thesis.carrental.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class ParticipantHandshakeHandler implements HandshakeInterceptor {

    private static final Logger LOG = LoggerFactory.getLogger(ParticipantHandshakeHandler.class);

    @Override
    public boolean beforeHandshake(
        final ServerHttpRequest request,
        final ServerHttpResponse response,
        final WebSocketHandler wsHandler,
        final Map<String, Object> attributes
    ) throws Exception {
        //false if we dont want to continue
        return true;
    }

    @Override
    public void afterHandshake(
        final ServerHttpRequest request,
        final ServerHttpResponse response,
        final WebSocketHandler wsHandler,
        final Exception exception
    ) {
        //DO NOTHING
    }
}
