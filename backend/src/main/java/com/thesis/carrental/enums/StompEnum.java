package com.thesis.carrental.enums;

public enum StompEnum {
    PARTICIPANT_SESSION_TOKEN_AND_ID_KEY("PARTICIPANT_ID_TOKEN");

    private final String value;

    StompEnum(final String value) {
        this.value = value;
    }

    @Override
    public String toString(){
        return value;
    }
}
