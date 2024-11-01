package com.thesis.carrental.dtos;

public class VehicleSaveResponse {

    private String message;
    private boolean success;
    private long feedbackId;

    public VehicleSaveResponse(final String message, final boolean success){
        this.message = message;
        this.success = success;
    }

    public VehicleSaveResponse(final String message, final boolean success, final long feedbackId){
        this.message = message;
        this.success = success;
        this.feedbackId = feedbackId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(final boolean success) {
        this.success = success;
    }

    public long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(final long feedbackId) {
        this.feedbackId = feedbackId;
    }
}
