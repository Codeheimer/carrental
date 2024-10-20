package com.thesis.carrental.services;

import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.enums.FileUploadType;
import com.thesis.carrental.repositories.FileUploadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class FileUploadService {

    private static final Logger LOG = LoggerFactory.getLogger(FileUploadService.class);

    private final FileUploadRepository fileUploadRepository;

    @Autowired
    public FileUploadService(
        FileUploadRepository fileUploadRepository
    ) {
        this.fileUploadRepository = fileUploadRepository;
    }

    public boolean saveFile(
        final Long id,
        final MultipartFile file,
        final FileUploadType type,
        final String directory
    ) {
        try {
            final String ownerDir = directory + "/" + id;
            final Path path = Paths.get(ownerDir);

            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            byte[] bytes = file.getBytes();
            String fileName = type + "-" + new Date().getTime();
            Path filePath = path.resolve(fileName);
            Files.write(filePath, bytes);
            fileUploadRepository.save(new FileUpload(id, ownerDir + "/" + fileName,type));
            return true;
        } catch (Exception e) {
            LOG.error("Error uploading file, reason: {}", e.getMessage());
            return false;
        }
    }

    public List<FileUpload> fetchByOwnerIds(final List<Long> ids, final List<FileUploadType> types) {
        if (Objects.nonNull(ids) && !ids.isEmpty()) {
            return fileUploadRepository.findByOwnerIds(ids, types);
        }
        return Collections.emptyList();
    }
}
