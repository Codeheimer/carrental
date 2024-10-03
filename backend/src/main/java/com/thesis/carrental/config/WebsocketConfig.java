package com.thesis.carrental.config;

import com.thesis.carrental.entities.LoginSession;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.services.JWTService;
import com.thesis.carrental.services.LoginSessionService;
import com.thesis.carrental.services.ParticipantService;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import static com.thesis.carrental.enums.StompEnum.PARTICIPANT_SESSION_TOKEN_AND_ID_KEY;

@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger LOG = LoggerFactory.getLogger(WebsocketConfig.class);

    private final JWTService jwtService;

    private final ParticipantService participantService;

    private final LoginSessionService loginSessionService;

    private final Map<String, Long> loginSessionsMap = new ConcurrentHashMap<>();
    @Autowired
    public WebsocketConfig(JWTService jwtService, ParticipantService participantService,
        LoginSessionService loginSessionService
    ) {
        this.jwtService = jwtService;
        this.participantService = participantService;
        this.loginSessionService = loginSessionService;
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
                final org.springframework.messaging.Message<?> message,
                final MessageChannel channel
            ) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                    message,
                    StompHeaderAccessor.class
                );
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    LOG.info("New STOMP connection received");
                    // Here you can add authentication logic if needed
                    // accessor.setUser(yourAuthenticationObject);
                }
                return message;
            }
        });
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        final Map<String, List<String>> nativeHeaders = getNativeHeaders(event);
        if(Objects.isNull(nativeHeaders)){
            return;
        }

        final List<String> authorization = nativeHeaders.get("Authorization");
        final String token = authorization.getFirst().split(" ")[1];
        if(!jwtService.validateToken(token)){
            return;
        }

        final Participant participant = participantService.findParticipantByLogin(jwtService.extractLogin(token));
        final String key = participant.getId() + "|" + token;
        loginSessionService.deleteSession(participant.getId());
        final long loginSessionId = loginSessionService.saveSession(participant.getId(), token);
        loginSessionsMap.put(key, loginSessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        final Map<String, List<String>> nativeHeaders = getNativeHeaders(event);
        if(Objects.isNull(nativeHeaders)){
            return;
        }

        final List<String> authorization = nativeHeaders.get("Authorization");
        final String token = authorization.getFirst().split(" ")[1];
        if(!jwtService.validateToken(token)){
            return;
        }

        final Participant participant = participantService.findParticipantByLogin(jwtService.extractLogin(token));
        loginSessionsMap.remove(participant.getId() + "|" + token);
        loginSessionService.deleteSession(participant.getId());

    }

    @SuppressWarnings("unchecked")
    private Map<String,List<String>> getNativeHeaders(AbstractSubProtocolEvent event){
        return ((Map<String, List<String>>) event.getMessage().getHeaders().get("nativeHeaders"));
    }

    @PreDestroy
    public void clearLoginSessions(){
        loginSessionService.evictAll();
    }
}
