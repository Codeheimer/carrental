package com.thesis.carrental.security;

import com.thesis.carrental.enums.FileUploadType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileUploadService {

    private static final Logger LOG = LoggerFactory.getLogger(FileUploadService.class);
    private final String uploadDir;

    public FileUploadService(@Value("${fileupload.dir}")final String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public boolean saveFile(final Long participantId, final MultipartFile file, final FileUploadType type){
        try{
            final String ownerDir = uploadDir + "/" + participantId;
            final Path path = Paths.get(ownerDir);

            if(!Files.exists(path)){
                Files.createDirectories(path);
            }

            byte[] bytes = file.getBytes();
            String fileName = type + "-" + file.getOriginalFilename();
            Path filePath = path.resolve(fileName);
            Files.write(filePath, bytes);
            return true;
        }catch (Exception e){
            LOG.error("Error uploading file, reason: {}",e.getMessage());
            return false;
        }
    }
}
