package com.thesis.carrental.entities;

import com.thesis.carrental.enums.LookUpType;
import jakarta.persistence.Entity;

@Entity
public class LookUp extends PersistentEntity {

    private Long parent;
    private LookUpType type;

    private String value;

    private String label;

    public LookUp() {
    }

    public LookUp(final LookUpType type, final String value, final String label){
        this.type = type;
        this.value = value;
        this.label = label;
    }

    public LookUp(final Long parent, final LookUpType type, final String value, final String label){
        this.parent = parent;
        this.type = type;
        this.value = value;
        this.label = label;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(final Long parent) {
        this.parent = parent;
    }

    public LookUpType getType() {
        return type;
    }

    public void setType(final LookUpType type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(final String value) {
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(final String label) {
        this.label = label;
    }
}
