package com.thesis.carrental.controllers;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    @GetMapping("/download")
    public ResponseEntity<Resource> requestImage(@RequestParam final String filePath){
        try{
            Path imagePath = Paths.get(filePath);
            Resource resource = new UrlResource(imagePath.toUri());
            if(resource.exists() && resource.isReadable()){
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
            }
            return ResponseEntity.notFound().build();
        }catch (MalformedURLException e){
            return ResponseEntity.badRequest().build();
        }
    }
}
