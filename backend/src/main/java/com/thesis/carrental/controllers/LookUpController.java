package com.thesis.carrental.controllers;

import com.thesis.carrental.entities.LookUp;
import com.thesis.carrental.filters.LookUpFilter;
import com.thesis.carrental.services.LookUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lookup")
public class LookUpController {

    private final LookUpService lookUpService;

    @Autowired
    public LookUpController(LookUpService lookUpService) {
        this.lookUpService = lookUpService;
    }

    @GetMapping("/")
    public ResponseEntity<List<LookUp>> getByType(LookUpFilter filter) {
        return ResponseEntity.ok(lookUpService.fetchByTypes(filter));
    }

    @PostMapping("/")
    public ResponseEntity<?> save(final LookUp lookUp) {
        lookUpService.saveLookUp(lookUp.getType(), lookUp.getValue(), lookUp.getLabel());
        return ResponseEntity.ok().build();
    }
}
