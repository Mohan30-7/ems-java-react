package com.ems.controllers;

import com.ems.models.HelpRequest;
import com.ems.models.User;
import com.ems.payload.request.MessageRequest;
import com.ems.payload.request.ReplyRequest;
import com.ems.payload.response.MessageResponse;
import com.ems.repository.HelpRequestRepository;
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
@RequestMapping("/api/messages")
public class HelpRequestController {

  @Autowired private HelpRequestRepository helpRequestRepository;

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
  public ResponseEntity<?> createMessage(@RequestBody MessageRequest request) {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }

    HelpRequest helpRequest = new HelpRequest(user, request.getContent(), "PENDING");
    helpRequestRepository.save(helpRequest);

    return ResponseEntity.ok(new MessageResponse("Message sent successfully"));
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<List<HelpRequest>> getMyMessages() {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok(helpRequestRepository.findByUserOrderByIdDesc(user));
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<HelpRequest>> getAllMessages() {
    return ResponseEntity.ok(helpRequestRepository.findAllByOrderByIdDesc());
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> replyToMessage(
      @PathVariable Long id, @RequestBody ReplyRequest request) {
    Optional<HelpRequest> helpReqOpt = helpRequestRepository.findById(id);
    if (!helpReqOpt.isPresent()) {
      return ResponseEntity.notFound().build();
    }

    HelpRequest helpRequest = helpReqOpt.get();
    if ("RESOLVED".equals(helpRequest.getStatus()) || helpRequest.getAdminReply() != null) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Message has already been replied to."));
    }

    User admin = getCurrentUser();
    if (admin == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Admin user not found."));
    }

    helpRequest.setAdminReply(request.getAdminReply());
    helpRequest.setStatus("RESOLVED");
    helpRequest.setRepliedByAdmin(admin.getUsername());

    helpRequestRepository.save(helpRequest);
    return ResponseEntity.ok(new MessageResponse("Reply sent successfully"));
  }
}
