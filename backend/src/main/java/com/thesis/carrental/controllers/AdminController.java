package com.thesis.carrental.controllers;

import com.thesis.carrental.dtos.ChangePasswordRequest;
import com.thesis.carrental.dtos.FetchUsersResponse;
import com.thesis.carrental.dtos.UserUpdateResponse;
import com.thesis.carrental.enums.ParticipantStatus;
import com.thesis.carrental.services.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/admin")
public class AdminController extends BaseController {

    private final Logger LOG = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<FetchUsersResponse> fetchUsers() {
        try{
            return ResponseEntity.ok(new FetchUsersResponse(true,null,adminService.fetchUsers()));
        }catch (Exception e){
            LOG.error("Error fetching users: {}",e.getMessage());
            return ResponseEntity.ok().body(new FetchUsersResponse(false,"Failed to fetch users", Collections.emptyList()));
        }
    }

    @PutMapping("/user/{id}/status/{status}")
    public ResponseEntity<UserUpdateResponse> updateUserStatus(
        @PathVariable("id") final Long id,
        @PathVariable("status") final ParticipantStatus status){
        adminService.updateParticipantStatus(id,status);
        return ResponseEntity.ok(new UserUpdateResponse("User updated.",true));
    }

    @PutMapping("/user/{id}/toggleDeactivate")
    public ResponseEntity<UserUpdateResponse> toggleDeactivateUser(
        @PathVariable("id") final Long id){
        adminService.toggleDeactivate(id);
        return ResponseEntity.ok(new UserUpdateResponse("Success",true));
    }

    @PutMapping("/user/{id}/changePass")
    public ResponseEntity<UserUpdateResponse> changePassword(
        @PathVariable("id") final Long id,
        @RequestBody final ChangePasswordRequest request){
        adminService.changePassword(id, request.newPassword());
        return ResponseEntity.ok(new UserUpdateResponse("Success",true));
    }

}
