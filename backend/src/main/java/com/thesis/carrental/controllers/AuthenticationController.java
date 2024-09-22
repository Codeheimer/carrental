package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.AuthenticationRequest;
import com.thesis.carrental.dtos.AuthenticationResponse;
import com.thesis.carrental.dtos.RegistrationRequest;
import com.thesis.carrental.dtos.RegistrationResponse;
import com.thesis.carrental.dtos.TokenVerifyResponse;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.services.JWTService;
import com.thesis.carrental.services.ParticipantService;
import com.thesis.carrental.services.ParticipantUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private ParticipantUserDetailsService participantUserDetailsService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ParticipantService participantService;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

    @PostMapping(value = "/addNewUser", consumes = {"multipart/form-data"})
    public ResponseEntity<RegistrationResponse> addNewUser(@RequestPart("registrationData") RegistrationRequest registrationRequest,
        @RequestPart("identification") final MultipartFile identification,
        @RequestPart("businessPermit") final MultipartFile businessPermit) {
        try{
            return ResponseEntity.ok(participantUserDetailsService.addUser(registrationRequest,identification,businessPermit));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new RegistrationResponse("Failed to add user, reason: "+e.getMessage()));
        }
    }

    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/generateToken")
    public ResponseEntity<AuthenticationResponse> authenticateAndGetToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.email(), authenticationRequest.password())
            );
            if (authentication.isAuthenticated()) {
                final String login = authenticationRequest.email();
                final Participant participant = participantService.findParticipantByLogin(login);
                return ResponseEntity.ok(new AuthenticationResponse(String.valueOf(participant.getId()),jwtService.generateToken(login),null));
            } else {
                return ResponseEntity.badRequest().body(new AuthenticationResponse(String.valueOf(0),"", "Login Credentials Invalid"));
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new AuthenticationResponse(String.valueOf(0),"", "Error in authentication, reason: "+e.getMessage()));
        }
    }

    @PostMapping("/verifyToken")
    public ResponseEntity<TokenVerifyResponse> verifyToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try{
            return ResponseEntity.ok(new TokenVerifyResponse(jwtService.validateToken(authenticationRequest.token()),"Token valid"));
        }catch (ExpiredJwtException e){
            return ResponseEntity.ok(new TokenVerifyResponse(false,"Token expired"));
        }
    }
}
