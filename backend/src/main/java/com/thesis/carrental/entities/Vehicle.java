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

    private Long owner;

    public Vehicle(){}

    public Vehicle(final String make, final String model, final String year, final String engineDisplacement, final int seater){
        this.make = make;
        this.model = model;
        this.year = year;
        this.engineDisplacement = engineDisplacement;
        this.seater = seater;
    }

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

    public Long getOwner() {
        return owner;
    }

    public void setOwner(final Long owner) {
        this.owner = owner;
    }
}
