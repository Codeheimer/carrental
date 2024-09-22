package com.thesis.carrental.controllers;

import jakarta.servlet.http.HttpServletRequest;

public abstract class BaseController {

    protected String getToken(final HttpServletRequest httpServletRequest){
        final String authorizationHeader = httpServletRequest.getHeader("Authorization");
        if(authorizationHeader != null && authorizationHeader.split(" ").length == 2){
            return authorizationHeader.split(" ")[1];
        }
        return "";
    }


}
