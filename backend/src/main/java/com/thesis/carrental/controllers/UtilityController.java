package com.thesis.carrental.controllers;

import com.thesis.carrental.services.UtilityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/util")
public class UtilityController extends BaseController{
    private static final Logger LOG = LoggerFactory.getLogger(UtilityController.class);

    private final UtilityService utilityService;

    @Autowired
    public UtilityController(final UtilityService utilityService){
        this.utilityService = utilityService;
    }

    @PostMapping(value = "/process-addresses", consumes = {"multipart/form-data"})
    public ResponseEntity<?> processAddress(@RequestPart("addressJson") MultipartFile json){
        try{
            utilityService.processAddress(json);
            return ResponseEntity.ok("Success");
        }catch (Exception e){
            LOG.error("Error: ",e);
            return ResponseEntity.badRequest().body("Error in processing addresses");
        }
    }
}
