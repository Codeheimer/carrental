package com.thesis.carrental.entities;

import com.thesis.carrental.enums.AddressLocationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "address_locations")
public class AddressLocation extends PersistentEntity {

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private AddressLocation parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AddressLocation> children = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private AddressLocationType type;

    private String name;

    public AddressLocation getParent() {
        return parent;
    }

    public void setParent(AddressLocation parent) {
        this.parent = parent;
    }

    public List<AddressLocation> getChildren() {
        return children;
    }

    public void setChildren(final List<AddressLocation> children) {
        this.children = children;
    }

    public AddressLocationType getType() {
        return type;
    }

    public void setType(final AddressLocationType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }
}
