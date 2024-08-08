package com.thesis.carrental.entities;

import com.thesis.carrental.enums.LookUpType;
import jakarta.persistence.Entity;

@Entity
public class LookUp extends PersistentEntity {
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
