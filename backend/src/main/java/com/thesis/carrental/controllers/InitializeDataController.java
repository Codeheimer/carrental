package com.thesis.carrental.controllers;

import com.thesis.carrental.services.InitializeDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/initializedb")
public class InitializeDataController {

    private final InitializeDataService initializeDataService;

    @Autowired
    public InitializeDataController(InitializeDataService initializeDataService) {
        this.initializeDataService = initializeDataService;
    }

    @PostMapping("/")
    public ResponseEntity<?> initializeDB(){
        return ResponseEntity.ok(initializeDataService.initDb());
    }
}
