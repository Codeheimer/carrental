package com.thesis.carrental.services;

import com.thesis.carrental.dtos.UserResponse;
import com.thesis.carrental.entities.FileUpload;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.enums.ParticipantRoles;
import com.thesis.carrental.enums.ParticipantStatus;
import com.thesis.carrental.repositories.ParticipantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.thesis.carrental.enums.FileUploadType.*;

@Service
public class AdminService {

    private static final Logger LOG = LoggerFactory.getLogger(AdminService.class);

    private final ParticipantRepository participantRepository;

    private final FileUploadService fileUploadService;

    private final PasswordEncoder encoder;

    @Autowired
    public AdminService(
        final ParticipantRepository participantRepository,
        final FileUploadService fileUploadService,
        final PasswordEncoder encoder
    ) {
        this.participantRepository = participantRepository;
        this.fileUploadService = fileUploadService;
        this.encoder = encoder;
    }

    public List<UserResponse> fetchUsers() {
        final List<Participant> participants = participantRepository.findAll();
        participants.removeIf(p -> p.getRolesEnum().contains(ParticipantRoles.ADMIN));
        final List<Long> participantIds = participants.stream()
            .map(Participant::getId)
            .toList();

        final List<FileUpload> fileUploads =
            fileUploadService.fetchByOwnerIds(
                participantIds,
                List.of(IDENTIFICATION, BUSINESS_PERMIT, PROFILE_PICTURE)
            );

        final Map<Long, List<FileUpload>> uploadsByParticipantId = fileUploads.stream()
            .collect(Collectors.groupingBy(FileUpload::getOwnerId));

        return participants.stream()
            .map(p -> toUserResponse(
                p,
                uploadsByParticipantId.getOrDefault(p.getId(), new ArrayList<>())
            ))
            .collect(Collectors.toList());
    }

    public void updateParticipantStatus(final Long participantId, final ParticipantStatus status) {
        final Optional<Participant> p = participantRepository.findById(participantId);
        if (p.isPresent()) {
            final Participant participant = p.get();
            participant.setStatus(status);
            if (status.equals(ParticipantStatus.APPROVED)) {
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
                IDENTIFICATION.toString()))
            .findFirst().map(FileUpload::getPath).orElse(null);
        final String businessPermit = uploads.stream()
            .filter(fileUpload -> fileUpload.getPath().contains(
                BUSINESS_PERMIT.toString()))
            .findFirst().map(FileUpload::getPath).orElse(null);

        final String profilePicture = uploads.stream()
            .filter(fileUpload -> fileUpload.getPath().contains(
                PROFILE_PICTURE.toString()))
            .findFirst().map(FileUpload::getPath).orElse(null);
        return new UserResponse(
            participant.getId(),
            participant.getDisplayName(),
            participant.getStatus(),
            identification,
            businessPermit,
            profilePicture,
            participant.isDeactived()
        );
    }

    public void toggleDeactivate(final Long id) {
        final Participant p = participantRepository.findById(id).orElseThrow();
        p.setDeactived(!p.isDeactived());
        participantRepository.save(p);
    }

    public void changePassword(final Long id, final String s) {
        final Participant p = participantRepository.findById(id).orElseThrow();
        p.setPassword(encoder.encode(s));
        participantRepository.save(p);
    }
}
