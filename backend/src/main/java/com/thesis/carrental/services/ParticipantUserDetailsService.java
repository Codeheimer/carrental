package com.thesis.carrental.services;

import com.thesis.carrental.dtos.RegistrationRequest;
import com.thesis.carrental.dtos.RegistrationResponse;
import com.thesis.carrental.entities.AddressLocation;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.enums.ParticipantRoles;
import com.thesis.carrental.repositories.AddressLocationRepository;
import com.thesis.carrental.repositories.ParticipantRepository;
import com.thesis.carrental.security.ParticipantUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.Optional;

import static com.thesis.carrental.enums.FileUploadType.*;
import static com.thesis.carrental.enums.ParticipantStatus.*;

@Service
public class ParticipantUserDetailsService implements UserDetailsService {

    @Autowired
    private ParticipantRepository participantRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private AddressLocationRepository addressLocationRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private EmailService emailService;

    @Value("${fileupload.participants.dir}")
    private String participantUploads;

    @Value("${fileupload.profile.pictures.dir}")
    private String profileDir;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Participant> participant = participantRepository.findByLogin(username);

        return participant.map(ParticipantUserDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public RegistrationResponse addUser(
        final RegistrationRequest registrationRequest,
        final MultipartFile identification,
        final MultipartFile businessPermit,
        final MultipartFile profilePicture
    ) {

        final RegistrationResponse validation = validateRequest(registrationRequest);
        if (Objects.nonNull(validation)) {
            return validation;
        }

        final Participant participant = registrationRequest.toParticipant();
        populateAddressFields(participant, registrationRequest);
        participant.setPassword(encoder.encode(participant.getPassword()));
        participant.setStatus(PENDING);

        final StringBuilder roles = new StringBuilder(ParticipantRoles.ROLE_RENTEE.toString());

        if (participant.getEmail().equals("admin@admin.com")) {
            roles.append(",").append(ParticipantRoles.ADMIN);
            participant.setApproved(true);
            participant.setStatus(APPROVED);
        }

        if (registrationRequest.businessOwner()) {
            roles.append(",")
                .append(ParticipantRoles.ROLE_RENTER);
        }

        participant.setRoles(roles.toString());

        participantRepository.save(participant);

        final long id = participant.getId();
        if (id > 0) {
            fileUploadService.saveFile(id, profilePicture, PROFILE_PICTURE, profileDir);
            final StringBuilder errorMessage = new StringBuilder();
            final boolean identificationUploadSuccess = fileUploadService.saveFile(
                id,
                identification,
                IDENTIFICATION,
                participantUploads
            );
            if (!identificationUploadSuccess) {
                errorMessage.append("Participant saved but failed to upload identification ");
            }
            if (registrationRequest.businessOwner()) {
                final boolean businessPermitSuccess = fileUploadService.saveFile(
                    id,
                    businessPermit,
                    BUSINESS_PERMIT,
                    participantUploads
                );
                if (!businessPermitSuccess) {
                    return new RegistrationResponse(errorMessage.append("and business permit")
                        .toString(), false);
                }
            }

            if (!errorMessage.isEmpty()) {
                return new RegistrationResponse(errorMessage.toString(), false);
            }
        }

        /*emailService.send(participant.getEmail(),
            "Successfully created an account",
            REG_SUCCESS_TEMPLATE,
            Map.of()
        );*/
        return new RegistrationResponse("User Added Successfully", true);
    }

    private void populateAddressFields(
        final Participant participant,
        final RegistrationRequest registrationRequest
    ) {
        final String region = registrationRequest.region();
        final String province = registrationRequest.province();
        final String municipality = registrationRequest.municipality();
        final String barangay = registrationRequest.barangay();

        final AddressLocation regionAddressLocation = addressLocationRepository.findByNameAndParent(region,null);
        final AddressLocation provinceAddressLocation = addressLocationRepository.findByNameAndParent(province,regionAddressLocation);
        final AddressLocation municipalityAddressLocation = addressLocationRepository.findByNameAndParent(municipality,provinceAddressLocation);
        final AddressLocation barangayAddressLocation = addressLocationRepository.findByNameAndParent(barangay,municipalityAddressLocation);

        participant.setRegion(regionAddressLocation);
        participant.setProvince(provinceAddressLocation);
        participant.setMunicipality(municipalityAddressLocation);
        participant.setBarangay(barangayAddressLocation);
    }

    private RegistrationResponse validateRequest(final RegistrationRequest registrationRequest) {
        final Participant existing = participantRepository.findByLogin(registrationRequest.email())
            .orElse(null);
        if (Objects.nonNull(existing)) {
            return new RegistrationResponse("User already exists", false);
        }
        return null;
    }

}
