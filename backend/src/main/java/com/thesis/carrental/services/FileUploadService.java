package com.thesis.carrental.services;

import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.enums.FileUploadType;
import com.thesis.carrental.repositories.FileUploadRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
public class FileUploadService {

    private static final Logger LOG = LoggerFactory.getLogger(FileUploadService.class);
    private final String uploadDir;

    private final FileUploadRepository fileUploadRepository;

    @Autowired
    public FileUploadService(
        @Value("${fileupload.dir}") final String uploadDir,
        FileUploadRepository fileUploadRepository
    ) {
        this.uploadDir = uploadDir;
        this.fileUploadRepository = fileUploadRepository;
    }

    public boolean saveFile(
        final Long participantId,
        final MultipartFile file,
        final FileUploadType type
    ) {
        try {
            final String ownerDir = uploadDir + "/" + participantId;
            final Path path = Paths.get(ownerDir);

            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            byte[] bytes = file.getBytes();
            String fileName = type + "-" + file.getOriginalFilename();
            Path filePath = path.resolve(fileName);
            Files.write(filePath, bytes);
            fileUploadRepository.save(new FileUpload(participantId, ownerDir + "/" + fileName));
            return true;
        } catch (Exception e) {
            LOG.error("Error uploading file, reason: {}", e.getMessage());
            return false;
        }
    }

    public List<FileUpload> fetchByParticipantIds(final List<Long> ids) {
        if (Objects.nonNull(ids) && !ids.isEmpty()) {
            return fileUploadRepository.findByParticipantIds(ids);
        }
        return Collections.emptyList();
    }
}
