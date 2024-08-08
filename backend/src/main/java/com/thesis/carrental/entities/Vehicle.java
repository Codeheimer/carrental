package com.thesis.carrental.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class Vehicle extends PersistentEntity {

    private String make;

    private String model;

    private String year;

    @Column(name = "trim_level")
    private String trimLevel;

    private String trans;

    private int seater;

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

    public String getTrimLevel() {
        return trimLevel;
    }

    public void setTrimLevel(final String trimLevel) {
        this.trimLevel = trimLevel;
    }

    public String getTrans() {
        return trans;
    }

    public void setTrans(final String trans) {
        this.trans = trans;
    }

    public int getSeater() {
        return seater;
    }

    public void setSeater(final int seater) {
        this.seater = seater;
    }
}
