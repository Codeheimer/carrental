package com.thesis.carrental.entities;

import com.thesis.carrental.enums.ParticipantRoles;
import com.thesis.carrental.enums.ParticipantStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.apache.commons.lang3.StringUtils;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Entity
@Table(name = "participants")
public class Participant extends PersistentEntity {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private Instant birthdate;

    private String gender;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private AddressLocation region;

    @ManyToOne
    @JoinColumn(name = "province_id")
    private AddressLocation province;

    @ManyToOne
    @JoinColumn(name = "municipality_id")
    private AddressLocation municipality;

    @ManyToOne
    @JoinColumn(name = "barangay_id")
    private AddressLocation barangay;

    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String email;

    private String password;

    private String roles;

    private boolean approved;

    private boolean deactived;

    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public Instant getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(final Instant birthdate) {
        this.birthdate = birthdate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(final String gender) {
        this.gender = gender;
    }

    public AddressLocation getRegion() {
        return region;
    }

    public void setRegion(final AddressLocation region) {
        this.region = region;
    }

    public AddressLocation getProvince() {
        return province;
    }

    public void setProvince(final AddressLocation province) {
        this.province = province;
    }

    public AddressLocation getMunicipality() {
        return municipality;
    }

    public void setMunicipality(final AddressLocation municipality) {
        this.municipality = municipality;
    }

    public AddressLocation getBarangay() {
        return barangay;
    }

    public void setBarangay(final AddressLocation barangay) {
        this.barangay = barangay;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(final String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(final String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(final String roles) {
        this.roles = roles;
    }

    public String getDisplayName() {
        return this.firstName + " " + this.lastName;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(final boolean approved) {
        this.approved = approved;
    }

    public ParticipantStatus getStatus() {
        return status;
    }

    public void setStatus(final ParticipantStatus status) {
        this.status = status;
    }

    public boolean isDeactived() {
        return deactived;
    }

    public void setDeactived(final boolean deactived) {
        this.deactived = deactived;
    }

    public List<ParticipantRoles> getRolesEnum() {
        if (StringUtils.isEmpty(this.getRoles())) {
            return Collections.emptyList();
        }

        return Arrays.stream(this.getRoles().split(","))
            .map(ParticipantRoles::valueOf)
            .collect(Collectors.toList());
    }
}
