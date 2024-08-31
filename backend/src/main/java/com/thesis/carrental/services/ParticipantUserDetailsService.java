package com.thesis.carrental.services;

import com.thesis.carrental.dtos.RegistrationRequest;
import com.thesis.carrental.dtos.RegistrationResponse;
import com.thesis.carrental.entities.Participant;
import com.thesis.carrental.enums.ParticipantRoles;
import com.thesis.carrental.repositories.ParticipantRepository;
import com.thesis.carrental.security.FileUploadService;
import com.thesis.carrental.security.ParticipantUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static com.thesis.carrental.enums.FileUploadType.*;

@Service
public class ParticipantUserDetailsService implements UserDetailsService {
    @Autowired
    private ParticipantRepository participantRepository;
    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private FileUploadService fileUploadService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Participant> participant = participantRepository.findByLogin(username);

        return participant.map(ParticipantUserDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public RegistrationResponse addUser(final RegistrationRequest registrationRequest,
        final MultipartFile identification,
        final MultipartFile businessPermit) {
        final Participant participant = registrationRequest.toParticipant();
        participant.setPassword(encoder.encode(participant.getPassword()));

        final StringBuilder roles = new StringBuilder(ParticipantRoles.ROLE_RENTEE.toString());

        if(!businessPermit.isEmpty()){
            roles.append(",")
                .append(ParticipantRoles.ROLE_RENTER);
        }

        participant.setRoles(roles.toString());

        participantRepository.save(participant);

        final long id = participant.getId();
        if(id > 0){
            final StringBuilder errorMessage = new StringBuilder();
            final boolean identificationUploadSuccess = fileUploadService.saveFile(id,identification,IDENTIFICATION);
            if(!identificationUploadSuccess){
                errorMessage.append("Participant saved but failed to upload identification ");
            }
            if(registrationRequest.businessOwner()){
                final boolean businessPermitSuccess = fileUploadService.saveFile(id,businessPermit, BUSINESS_PERMIT);
                if(!businessPermitSuccess){
                    return new RegistrationResponse("and business permit");
                }
            }

            if(!errorMessage.isEmpty()){
                return new RegistrationResponse(errorMessage.toString());
            }
        }

        return new RegistrationResponse("User Added Successfully");
    }


}
