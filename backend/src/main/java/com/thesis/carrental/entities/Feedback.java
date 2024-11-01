package com.thesis.carrental.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="feedbacks")
public class Feedback extends PersistentEntity{

    private int stars;

    private String comment;

    @ManyToOne
    @JoinColumn(name = "commenter_id")
    private Participant commenter;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    public int getStars() {
        return stars;
    }

    public void setStars(final int stars) {
        this.stars = stars;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(final String comment) {
        this.comment = comment;
    }

    public Participant getCommenter() {
        return commenter;
    }

    public void setCommenter(Participant commenter) {
        this.commenter = commenter;
    }



    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
}
