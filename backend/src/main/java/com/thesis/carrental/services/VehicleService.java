package com.thesis.carrental.services;

import com.thesis.carrental.dtos.VehicleResult;
import com.thesis.carrental.dtos.VehicleUpdateRequest;
import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.enums.FileUploadType;
import com.thesis.carrental.enums.VehicleStatus;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.repositories.VehicleRepository;
import com.thesis.carrental.utils.DisplayUtil;
import jakarta.persistence.NoResultException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.thesis.carrental.enums.FileUploadType.*;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    private final ParticipantService participantService;

    private final FileUploadService fileUploadService;

    @Autowired
    public VehicleService(
        VehicleRepository vehicleRepository,
        ParticipantService participantService, FileUploadService fileUploadService
    ) {
        this.vehicleRepository = vehicleRepository;
        this.participantService = participantService;
        this.fileUploadService = fileUploadService;
    }

    public VehicleResult find(final Long id) {
        final Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            final Vehicle v = vehicle.get();
            return this.toResult(v, fileUploadService.fetchByOwnerIds(
                List.of(v.getId()),
                List.of(VEHICLE_PICTURE)
            ));
        }
        throw new NoResultException("Vehicle not exists");
    }

    public VehicleFilter filter(final VehicleFilter filter) {
        return filter(filter, Optional.of(new Participant()).get());
    }

    public VehicleFilter filter(final VehicleFilter filter, final Participant owner) {
        Page<Vehicle> result;
        if (filter.isOwn()) {
            result = vehicleRepository.byOwner(owner.getId(), filter);
        } else if (filter.isFilterEmpty()) {
            result = vehicleRepository.findAll(filter);
        } else {
            result = vehicleRepository.filter(
                filter.getMake(),
                filter.getModel(),
                filter.getYear(),
                filter.getEngineDisplacement(),
                filter.getSeater(),
                filter
            );
        }
        final List<Vehicle> results = result.getContent();
        final List<Long> ids = results.stream().map(Vehicle::getId).toList();
        final Map<Long, List<FileUpload>> uploadsByVehicle = fileUploadService
            .fetchByOwnerIds(ids, List.of(VEHICLE_PICTURE)).stream()
            .collect(Collectors.groupingBy(FileUpload::getOwnerId));

        filter.setResult(toResults(result.getContent(), uploadsByVehicle));
        filter.setTotalPages(result.getTotalPages());
        filter.setTotalResult(result.getTotalElements());
        return filter;
    }

    private List<VehicleResult> toResults(
        final List<Vehicle> vehicles,
        Map<Long, List<FileUpload>> uploads
    ) {
        return vehicles
            .stream()
            .map(v -> toResult(v, uploads.get(v.getId())))
            .collect(Collectors.toList());
    }

    private VehicleResult toResult(final Vehicle vehicle, final List<FileUpload> pictures) {
        final Participant owner = participantService.findById(vehicle.getOwner());
        final List<FileUpload> fileUploads =
            fileUploadService.fetchByOwnerIds(
                List.of(owner.getId()),
                List.of(PROFILE_PICTURE)
            );
        return new VehicleResult(
            vehicle.getId(),
            vehicle.getMake(),
            vehicle.getModel(),
            vehicle.getYear(),
            vehicle.getEngineDisplacement(),
            vehicle.getSeater(),
            vehicle.getTitle(),
            vehicle.getDescription(),
            vehicle.getPlateNumber(),
            String.valueOf(owner.getId()),
            owner.getDisplayName(),
            DisplayUtil.generateVehicleListingAge(vehicle.getCreationDate()),
            vehicle.getStatus(),
            vehicle.getPrice(),
            fileUploads.stream().map(FileUpload::getPath).findFirst().orElse(""),
            pictures.stream().map(FileUpload::getPath).limit(1).collect(Collectors.toList())
        );
    }

    public void save(final Vehicle vehicle, final Long owner) {
        vehicle.setOwner(owner);
        vehicle.setStatus(VehicleStatus.AVAILABLE.toString());
        vehicleRepository.save(vehicle);
    }

    public void updateStatus(final VehicleUpdateRequest request) {
        final Vehicle vehicle = this.vehicleRepository.findById(request.vehicleId()).orElseThrow();
        vehicle.setStatus(request.status().toString());
        vehicleRepository.save(vehicle);
    }
}
