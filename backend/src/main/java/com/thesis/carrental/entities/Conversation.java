package com.thesis.carrental.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversations")
public class Conversation extends PersistentEntity {
    private long owner;

    private long other;

    private boolean ownerUnread;
    private boolean otherUnread;

    public Conversation(){
    }

    public Conversation(final long owner, final long other){
        this.owner = owner;
        this.other = other;
    }

    public long getOwner() {
        return owner;
    }

    public void setOwner(final long owner) {
        this.owner = owner;
    }

    public long getOther() {
        return other;
    }

    public void setOther(final long other) {
        this.other = other;
    }

    public boolean isOwnerUnread() {
        return ownerUnread;
    }

    public void setOwnerUnread(final boolean ownerUnread) {
        this.ownerUnread = ownerUnread;
    }

    public boolean isOtherUnread() {
        return otherUnread;
    }

    public void setOtherUnread(final boolean otherUnread) {
        this.otherUnread = otherUnread;
    }
}
