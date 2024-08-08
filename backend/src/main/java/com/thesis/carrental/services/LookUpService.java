package com.thesis.carrental.services;

import com.thesis.carrental.entities.LookUp;
import com.thesis.carrental.enums.LookUpType;
import com.thesis.carrental.filters.LookUpFilter;
import com.thesis.carrental.repositories.LookUpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LookUpService {

    private final LookUpRepository lookUpRepository;

    @Autowired
    public LookUpService(final LookUpRepository lookUpRepository) {
        this.lookUpRepository = lookUpRepository;
    }

    public void saveLookUp(final LookUpType lookUpType, final String value, final String label){
        lookUpRepository.save(new LookUp(lookUpType,value,label));
    }

    public List<LookUp> fetchByTypes(final LookUpFilter filter){
        return lookUpRepository.byLookUpType(filter.types());
    }
}
