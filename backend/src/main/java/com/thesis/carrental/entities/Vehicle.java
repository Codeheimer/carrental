package com.thesis.carrental.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Vehicle extends PersistentEntity {

    private String make;

    private String model;

    private String year;

    @Column(name="engine_displacement")
    private String engineDisplacement;

    private int seater;

    private String description;

    private Long owner;

    private Double latitude;

    private Double longitude;

    public String getMake() {
        return make;
    }

    public void setMake(final String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(final String model) {
        this.model = model;
    }

    public String getYear() {
        return year;
    }

    public void setYear(final String year) {
        this.year = year;
    }

    public String getEngineDisplacement() {
        return engineDisplacement;
    }

    public void setEngineDisplacement(final String engineDisplacement) {
        this.engineDisplacement = engineDisplacement;
    }

    public int getSeater() {
        return seater;
    }

    public void setSeater(final int seater) {
        this.seater = seater;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public Long getOwner() {
        return owner;
    }

    public void setOwner(final Long owner) {
        this.owner = owner;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(final Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(final Double longitude) {
        this.longitude = longitude;
    }
}
