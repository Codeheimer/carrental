package com.thesis.carrental.entities;

import com.thesis.carrental.enums.FileUploadType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "file_uploads")
public class FileUpload extends PersistentEntity {

    @Column(name="owner_id")
    private long ownerId;

    private String path;

    @Enumerated(EnumType.STRING)
    private FileUploadType type;

    public FileUpload(){}

    public FileUpload(final long participantId, final String path, final FileUploadType type){
        this.ownerId = participantId;
        this.path = path;
        this.type = type;
    }

    public long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(final long ownerId) {
        this.ownerId = ownerId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(final String path) {
        this.path = path;
    }

    public FileUploadType getType() {
        return type;
    }

    public void setType(final FileUploadType type) {
        this.type = type;
    }
}
