package com.thesis.carrental.dtos;

import com.thesis.carrental.enums.FileUploadType;
import org.springframework.web.multipart.MultipartFile;

public record FileUploadRequest(
    FileUploadType type,
    MultipartFile file
) {
}
