package com.thesis.carrental.services;

import com.thesis.carrental.dtos.UserResponse;
import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.enums.FileUploadType;
import com.thesis.carrental.enums.ParticipantStatus;
import com.thesis.carrental.repositories.ParticipantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final Logger LOG = LoggerFactory.getLogger(AdminService.class);

    private final ParticipantRepository participantRepository;

    private final FileUploadService fileUploadService;

    @Autowired
    public AdminService(
        ParticipantRepository participantRepository,
        FileUploadService fileUploadService
    ) {
        this.participantRepository = participantRepository;
        this.fileUploadService = fileUploadService;
    }

    public List<UserResponse> fetchUsers() {
        final List<Participant> participants = participantRepository.findAll();
        final List<Long> participantIds = participants.stream()
            .map(Participant::getId)
            .toList();

        final List<FileUpload> fileUploads =
            fileUploadService.fetchByParticipantIds(participantIds);

        final Map<Long, List<FileUpload>> uploadsByParticipantId = fileUploads.stream()
            .collect(Collectors.groupingBy(FileUpload::getParticipantId));

        return participants.stream()
            .map(p -> toUserResponse(
                p,
                uploadsByParticipantId.getOrDefault(p.getId(), new ArrayList<>())
            ))
            .collect(Collectors.toList());
    }

    public void updateParticipantStatus(final Long participantId, final ParticipantStatus status){
        final Optional<Participant> p = participantRepository.findById(participantId);
        if(p.isPresent()){
            final Participant participant = p.get();
            participant.setStatus(status.name());
            if(status.equals(ParticipantStatus.APPROVED)){
                participant.setApproved(true);
            }
            participantRepository.save(participant);
        }
    }

    private UserResponse toUserResponse(
        final Participant participant,
        final List<FileUpload> uploads
    ) {
        final String identification = uploads.stream()
            .filter(fileUpload -> fileUpload.getPath().contains(
                FileUploadType.IDENTIFICATION.toString()))
            .findFirst().map(FileUpload::getPath).orElse(null);
        final String businessPermit = uploads.stream()
            .filter(fileUpload -> fileUpload.getPath().contains(
                FileUploadType.BUSINESS_PERMIT.toString()))
            .findFirst().map(FileUpload::getPath).orElse(null);
        return new UserResponse(
            participant.getId(),
            participant.getDisplayName(),
            participant.getStatus(),
            identification,
            businessPermit
        );
    }
}