package com.thesis.carrental.dtos;

public record AuthenticationRequest(String email, String password, String token, boolean rememberMe) {}
