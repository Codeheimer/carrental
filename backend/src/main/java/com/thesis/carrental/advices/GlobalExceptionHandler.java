package com.thesis.carrental.advices;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.thesis.carrental.dtos.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Invalid input format";

        // Get the specific field and type information
        if (ex.getCause() instanceof InvalidFormatException) {
            InvalidFormatException cause = (InvalidFormatException) ex.getCause();
            String fieldName = cause.getPath().isEmpty() ? "unknown" :
                cause.getPath().get(0).getFieldName();
            String expectedType = cause.getTargetType().getSimpleName();
            String invalidValue = cause.getValue().toString();

            message = String.format("Invalid value '%s' for field '%s'. Expected type: %s",
                invalidValue, fieldName, expectedType);
        }

        ErrorResponse errorResponse = new ErrorResponse(message,false);

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorResponse);
    }
}
