package com.thesis.carrental.services;

import com.thesis.carrental.dtos.Coordinate;
import com.thesis.carrental.dtos.FeedbackResponse;
import com.thesis.carrental.dtos.VehicleResult;
import com.thesis.carrental.dtos.VehicleUpdateRequest;
import com.thesis.carrental.emailing.EmailTemplate;
import com.thesis.carrental.entities.Feedback;
import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.entities.RentedVehicle;
import com.thesis.carrental.entities.Vehicle;
import com.thesis.carrental.enums.VehicleStatus;
import com.thesis.carrental.filters.VehicleFilter;
import com.thesis.carrental.repositories.FeedbackRepository;
import com.thesis.carrental.repositories.VehicleRepository;
import com.thesis.carrental.utils.DisplayUtil;
import com.thesis.carrental.utils.DistanceCalculator;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.thesis.carrental.emailing.EmailTemplates.TEMPLATES;
import static com.thesis.carrental.enums.EmailTypes.VEHICLE_FEEDBACK;
import static com.thesis.carrental.enums.FileUploadType.*;

@Service
public class VehicleService {

    private static final Logger LOG = LoggerFactory.getLogger(VehicleService.class);

    private final VehicleRepository vehicleRepository;

    private final ParticipantService participantService;

    private final FileUploadService fileUploadService;

    private final FeedbackRepository feedbackRepository;

    private final EmailService emailService;

    private final RentedVehicleService rentedVehicleService;

    @Autowired
    public VehicleService(
        final VehicleRepository vehicleRepository,
        final ParticipantService participantService,
        final FileUploadService fileUploadService,
        final FeedbackRepository feedbackRepository,
        final EmailService emailService,
        final RentedVehicleService rentedVehicleService
    ) {
        this.vehicleRepository = vehicleRepository;
        this.participantService = participantService;
        this.fileUploadService = fileUploadService;
        this.feedbackRepository = feedbackRepository;
        this.emailService = emailService;
        this.rentedVehicleService = rentedVehicleService;
    }

    public VehicleResult find(final Long id) {
        final Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            final Vehicle v = vehicle.get();
            return this.toResult(v, fileUploadService.fetchByOwnerIds(
                List.of(v.getId()),
                List.of(VEHICLE_PICTURE)
            ),true);
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
        } else if(filter.getRenterId() != null && filter.getRenterId() > 0){
            result = vehicleRepository.byRenter(filter.getRenterId(),filter);
        }else {
            result = vehicleRepository.filter(
                filter.getSearch(),
                filter.getMake(),
                filter.getModel(),
                filter.getYear(),
                filter.getEngineDisplacement(),
                filter.getSeater(),
                filter
            );
        }
        final List<Vehicle> results = getVehicles(filter, result);
        final List<Long> ids = results.stream().map(Vehicle::getId).toList();
        final Map<Long, List<FileUpload>> uploadsByVehicle = fileUploadService
            .fetchByOwnerIds(ids, List.of(VEHICLE_PICTURE)).stream()
            .collect(Collectors.groupingBy(FileUpload::getOwnerId));

        filter.setResult(toResults(results, uploadsByVehicle));
        filter.setTotalPages(result.getTotalPages());
        filter.setTotalResult(result.getTotalElements());
        return filter;
    }

    private static List<Vehicle> getVehicles(
        final VehicleFilter filter,
        final Page<Vehicle> result
    ) {
        final List<Vehicle> results = new ArrayList<>(result.getContent());
        final Coordinate coordinate = filter.getUserLocation();
        results.removeIf(v -> {
            if(Objects.isNull(coordinate)){
                return false;
            }
            final double distance = DistanceCalculator.calculateDistance(
                coordinate.latitude(),
                coordinate.longitude(),
                v.getLatitude(),
                v.getLongitude());
            LOG.info("Vehicle ID: {} , distance: {}",v.getId(),distance);
            return distance > filter.getMaxKm();
        });
        return results;
    }

    private List<VehicleResult> toResults(
        final List<Vehicle> vehicles,
        Map<Long, List<FileUpload>> uploads
    ) {
        return vehicles
            .stream()
            .map(v -> toResult(v, uploads.get(v.getId()),false))
            .collect(Collectors.toList());
    }

    private VehicleResult toResult(final Vehicle vehicle, final List<FileUpload> pictures, final boolean includeAllPictures) {
        final Participant owner = participantService.findById(vehicle.getOwner());
        final List<FileUpload> fileUploads =
            fileUploadService.fetchByOwnerIds(
                List.of(owner.getId()),
                List.of(PROFILE_PICTURE)
            );

        final List<FeedbackResponse> feedbackResponses = vehicle.getFeedbacks().stream().sorted(Comparator.comparing(Feedback::getCreationDate).reversed()).map(this::toFeedbackResponse).toList();
        final double average = feedbackResponses.stream().mapToInt(FeedbackResponse::rate).average().orElse(0);
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
            vehicle.getStatus().toString(),
            vehicle.getPrice(),
            fileUploads.stream().map(FileUpload::getPath).findFirst().orElse(""),
            pictures.stream().map(FileUpload::getPath).limit(includeAllPictures ? 5 : 1).collect(Collectors.toList()),
            feedbackResponses,
            average
        );
    }

    private FeedbackResponse toFeedbackResponse(final Feedback feedback){
        return new FeedbackResponse(feedback.getId(),feedback.getStars(),feedback.getComment(),feedback.getCommenter().getDisplayName());
    }

    public void save(final Vehicle vehicle, final Long owner) {
        vehicle.setOwner(owner);
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
    }

    @Transactional
    public void updateStatus(final VehicleUpdateRequest request) {
        final Vehicle vehicle = this.vehicleRepository.findById(request.vehicleId()).orElseThrow();
        vehicle.setStatus(request.status());
        doActionPerStatus(vehicle);
        vehicleRepository.save(vehicle);
    }

    private void doActionPerStatus(final Vehicle vehicle){
        switch (vehicle.getStatus()){
            case AVAILABLE -> {
                final RentedVehicle rv = rentedVehicleService.findRentDetails(vehicle);
                final EmailTemplate template = TEMPLATES.get(VEHICLE_FEEDBACK);
                final Map<String,Object> fields = new HashMap<>();
                fields.put("customerName", rv.getParticipant().getDisplayName());
                fields.put("makeModel", vehicle.getMake() + " "+vehicle.getModel());
                fields.put("plateNumber", vehicle.getPlateNumber());
                //http://localhost:3000/vehicle/listing/
                fields.put("feedbackUrl","http://localhost:3000/vehicle/listing/"+vehicle.getId());
                emailService.send(rv.getParticipant().getEmail(),template.title(),template.path(),fields);
            }
            default -> throw new RuntimeException("Status invalid");
        }
    }

    public Feedback rateVehicle(final long vehicleId, final long commenterId, final int stars, final String comment){
        final Feedback feedback = new Feedback();
        final Participant participant = participantService.findById(commenterId);
        feedback.setVehicle(vehicleRepository.findById(vehicleId).orElseThrow());
        feedback.setCommenter(participant);
        feedback.setComment(comment);
        feedback.setStars(stars);
        feedbackRepository.save(feedback);
        return feedback;
    }
}
