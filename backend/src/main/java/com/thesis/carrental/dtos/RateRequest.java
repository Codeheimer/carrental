package com.thesis.carrental.dtos;

public class RateRequest {
    private long vehicleId;
    private long commenterId;
    private String comment;
    private int rate;

    public long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(final long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public long getCommenterId() {
        return commenterId;
    }

    public void setCommenterId(final long commenterId) {
        this.commenterId = commenterId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(final String comment) {
        this.comment = comment;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(final int rate) {
        this.rate = rate;
    }
}
