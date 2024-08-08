package com.thesis.carrental.services;

import com.thesis.carrental.entities.LookUp;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.enums.LookUpType;
import org.springframework.stereotype.Service;

@Service
public class InitializeDataService {

    private final LookUpService lookUpService;
    private final VehicleService vehicleService;

    public InitializeDataService(LookUpService lookUpService, VehicleService vehicleService) {
        this.lookUpService = lookUpService;
        this.vehicleService = vehicleService;
    }

    public String initDb() {
        final LookUp toyota = new LookUp(LookUpType.VEHICLE_MAKE,"Toyota","Toyota");
        final LookUp mitsubishi = new LookUp(LookUpType.VEHICLE_MAKE,"Mitsubishi","Mitsubishi");
        final LookUp honda = new LookUp(LookUpType.VEHICLE_MAKE,"Honda","Honda");

        lookUpService.saveLookUp(toyota);
        lookUpService.saveLookUp(mitsubishi);
        lookUpService.saveLookUp(honda);

        final LookUp vios = new LookUp(toyota.getId(),LookUpType.VEHICLE_MODEL,"Vios","Vios");
        final LookUp mirage = new LookUp(mitsubishi.getId(),LookUpType.VEHICLE_MODEL,"Mirage","Mirage");
        final LookUp city = new LookUp(honda.getId(),LookUpType.VEHICLE_MODEL,"City","City");
        lookUpService.saveLookUp(vios);
        lookUpService.saveLookUp(mirage);
        lookUpService.saveLookUp(city);

        final Vehicle toyotaVios = new Vehicle(toyota.getValue(),vios.getValue(),"2024","1.3", 5);
        final Vehicle mitsubishiMirage = new Vehicle(mitsubishi.getValue(),mirage.getValue(),"2024","1.2", 5);
        final Vehicle HondaCity = new Vehicle(honda.getValue(),city.getValue(),"2023","1.5", 5);

        vehicleService.save(toyotaVios);
        vehicleService.save(mitsubishiMirage);
        vehicleService.save(HondaCity);

        return "done";
    }
}
