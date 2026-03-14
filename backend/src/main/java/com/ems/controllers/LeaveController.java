package com.ems.controllers;

import com.ems.models.LeaveRequest;
import com.ems.models.User;
import com.ems.payload.request.CreateLeaveRequest;
import com.ems.payload.request.ReplyLeaveRequest;
import com.ems.payload.response.MessageResponse;
import com.ems.repository.LeaveRequestRepository;
import com.ems.repository.UserRepository;
import com.ems.security.services.UserDetailsImpl;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leave")
public class LeaveController {

  @Autowired private LeaveRequestRepository leaveRequestRepository;

  @Autowired private UserRepository userRepository;

  private User getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return null;
    }
    UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
    return userRepository.findById(userDetails.getId()).orElse(null);
  }

  @PostMapping("/my")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> createLeaveRequest(@RequestBody CreateLeaveRequest request) {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }

    LeaveRequest leaveRequest =
        new LeaveRequest(
            user,
            request.getStartDate(),
            request.getEndDate(),
            request.getLeaveType(),
            request.getReason(),
            "PENDING");
    leaveRequestRepository.save(leaveRequest);

    return ResponseEntity.ok(new MessageResponse("Leave request submitted successfully"));
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<List<LeaveRequest>> getMyLeaveRequests() {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok(leaveRequestRepository.findByUserOrderByCreatedAtDesc(user));
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
    return ResponseEntity.ok(leaveRequestRepository.findAllByOrderByCreatedAtDesc());
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> replyToLeaveRequest(
      @PathVariable Long id, @RequestBody ReplyLeaveRequest request) {
    Optional<LeaveRequest> leaveReqOpt = leaveRequestRepository.findById(id);
    if (!leaveReqOpt.isPresent()) {
      return ResponseEntity.notFound().build();
    }

    LeaveRequest leaveRequest = leaveReqOpt.get();
    if (!"PENDING".equals(leaveRequest.getStatus())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Leave request is already " + leaveRequest.getStatus()));
    }

    User admin = getCurrentUser();
    if (admin == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Admin user not found."));
    }

    leaveRequest.setStatus(request.getStatus());
    leaveRequest.setAdminReply(request.getAdminReply());
    leaveRequest.setRepliedByAdmin(admin.getUsername());

    leaveRequestRepository.save(leaveRequest);
    return ResponseEntity.ok(
        new MessageResponse("Leave request " + request.getStatus() + " successfully"));
  }
}
