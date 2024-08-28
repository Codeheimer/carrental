package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.AuthenticationRequest;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.services.JWTService;
import com.thesis.carrental.services.ParticipantUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private ParticipantUserDetailsService participantUserDetailsService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

    @PostMapping("/addNewUser")
    public ResponseEntity<?> addNewUser(@RequestBody Participant participant) {
        try{
            return ResponseEntity.ok(participantUserDetailsService.addUser(participant));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Failed to add user, reason: "+e.getMessage());
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
    public String authenticateAndGetToken(@RequestBody AuthenticationRequest authenticationRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authenticationRequest.login(), authenticationRequest.password())
        );
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authenticationRequest.login());
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @PostMapping("/verifyToken")
    public boolean verifyToken(@RequestBody AuthenticationRequest authenticationRequest) {
        return jwtService.validateToken(authenticationRequest.token());
    }
}
