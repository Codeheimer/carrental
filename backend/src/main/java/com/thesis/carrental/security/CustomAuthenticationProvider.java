package com.thesis.carrental.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CustomAuthenticationProvider extends DaoAuthenticationProvider {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder encoder;

    public CustomAuthenticationProvider(
        final UserDetailsService userDetailsService,
        final PasswordEncoder encoder
    ) {
        this.userDetailsService = userDetailsService;
        this.encoder = encoder;
    }

    @Override
    public Authentication authenticate(final Authentication authentication) throws AuthenticationException {
        final String email = authentication.getName();
        final String password = (String) authentication.getCredentials();

        final UserDetails user = userDetailsService.loadUserByUsername(email);

        if(!user.isEnabled()){
            throw new AuthenticationException("Account is still being reviewed.Please contact your Administrator.") {};
        }

        if(!user.isAccountNonLocked()){
            throw new AuthenticationException("Error logging in. Please contact your Administrator.") {};
        }

        if (email != null && encoder.matches(password,user.getPassword())) {
            return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
        } else {
            throw new AuthenticationException("Invalid Credentials.") {};
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
