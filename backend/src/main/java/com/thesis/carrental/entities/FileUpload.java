package com.thesis.carrental.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "file_uploads")
public class FileUpload extends PersistentEntity {

    private long participantId;

    private String path;

    public FileUpload(){}

    public FileUpload(final long participantId, final String path){
        this.participantId = participantId;
        this.path = path;
    }

    public long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(final long participantId) {
        this.participantId = participantId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(final String path) {
        this.path = path;
    }
}
