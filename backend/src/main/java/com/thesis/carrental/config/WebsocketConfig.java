package com.thesis.carrental.config;

import com.thesis.carrental.controllers.WebsocketController;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.services.JWTService;
import com.thesis.carrental.services.LoginSessionService;
import com.thesis.carrental.services.ParticipantService;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;
import java.util.Objects;

import static com.thesis.carrental.enums.LoginState.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger LOG = LoggerFactory.getLogger(WebsocketConfig.class);

    private final JWTService jwtService;

    private final ParticipantService participantService;

    private final LoginSessionService loginSessionService;

    private final WebsocketController websocketController;

    @Autowired
    public WebsocketConfig(
        final JWTService jwtService,
        final ParticipantService participantService,
        final LoginSessionService loginSessionService,
        @Lazy final WebsocketController websocketController
    ) {
        this.jwtService = jwtService;
        this.participantService = participantService;
        this.loginSessionService = loginSessionService;
        this.websocketController = websocketController;
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/user");
        registry.setUserDestinationPrefix("/user");
        registry.setApplicationDestinationPrefixes("/ws");
    }

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry
            .addEndpoint("/mywebsocket")
            .setAllowedOrigins("http://localhost:3000/")
            .addInterceptors(new ParticipantHandshakeHandler())
            .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(
                final Message<?> message,
                final MessageChannel channel
            ) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                    message,
                    StompHeaderAccessor.class
                );
                if (Objects.nonNull(accessor) && Objects.nonNull(accessor.getCommand())) {
                    final List<String> authorization = accessor.getNativeHeader("Authorization");
                    if (Objects.nonNull(authorization) && !authorization.isEmpty()) {
                        final String token = authorization.getFirst().split(" ")[1];
                        if (!jwtService.validateToken(token)) {
                            return message;
                        }

                        final Participant participant = participantService.findParticipantByLogin(
                            jwtService.extractLogin(token));
                        switch (accessor.getCommand()) {
                            case CONNECT:
                                LOG.info("Participant: {} CONNECTING...",participant.getId());
                                loginSessionService.deleteSession(participant.getId());
                                loginSessionService.saveSession(participant.getId(), token);
                                websocketController.broadcastLoginState(participant, LOGIN);
                                break;
                            case DISCONNECT:
                                LOG.info("Participant: {} DISCONNECTING...",participant.getId());
                                loginSessionService.deleteSession(participant.getId());
                                websocketController.broadcastLoginState(participant, LOGOUT);
                                break;
                            default:
                                break;
                        }

                    }
                }
                return message;
            }
        });
    }

    @PreDestroy
    public void clearLoginSessions() {
        loginSessionService.evictAll();
    }
}
