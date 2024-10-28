package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.LookUpResponse;
import com.thesis.carrental.enums.AddressLocationType;
import com.thesis.carrental.services.UtilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ui")
public class UIController {

    private final UtilityService utilityService;

    @Autowired
    public UIController(UtilityService utilityService) {
        this.utilityService = utilityService;
    }

    @GetMapping("/address-lookup/{type}")
    private List<LookUpResponse> addressLookUp(
        @PathVariable("type") final AddressLocationType type
    ) {
        return utilityService.getByType(type,null,null)
            .stream().map(al -> new LookUpResponse(al.getName()))
            .collect(Collectors.toList());
    }

    @GetMapping("/address-lookup/{parentType}/{parent}/{type}")
    private List<LookUpResponse> addressLookUpWithParent(
        @PathVariable("type") final AddressLocationType type,
        @PathVariable("parentType") final AddressLocationType parentType,
        @PathVariable("parent") final String parentValue
    ) {
        return utilityService.getByType(type,parentType,parentValue)
            .stream().map(al -> new LookUpResponse(al.getName()))
            .collect(Collectors.toList());
    }
}
