package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.DistanceBody;
import com.thesis.carrental.services.CalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calculate")
public class CalculationController {

    private final CalculationService calculationService;

    @Autowired
    public CalculationController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @PostMapping("/distance")
    public ResponseEntity<?> calculateDistance(@RequestBody DistanceBody distanceBody) {
        try{
            return ResponseEntity.ok(calculationService.calculate(distanceBody));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error calculating distance");
        }
    }
}
