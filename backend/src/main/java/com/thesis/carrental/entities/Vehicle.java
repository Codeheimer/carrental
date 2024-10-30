package com.thesis.carrental.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.thesis.carrental.enums.VehicleStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Transient;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Vehicle extends PersistentEntity {

    private String make;

    private String model;

    private String year;

    @Column(name="engine_displacement")
    private String engineDisplacement;

    private int seater;

    private String title;

    private String description;

    private Long owner;

    @Column(name = "plate_number")
    private String plateNumber;

    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    @Column(name="daily_price")
    private double price;

    @Transient
    @JsonIgnore
    private List<String> images = new ArrayList<>();

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

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
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

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(final String plateNumber) {
        this.plateNumber = plateNumber;
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

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(final VehicleStatus status) {
        this.status = status;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(final double price) {
        this.price = price;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(final List<String> images) {
        this.images = images;
    }
}
