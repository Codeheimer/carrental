package com.thesis.carrental.dtos;

public class ErrorResponse extends AbstractResponse{

    public ErrorResponse(final String message, final boolean success) {
        super(message, success);
    }
}
