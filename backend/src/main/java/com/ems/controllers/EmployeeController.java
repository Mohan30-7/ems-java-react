package com.ems.controllers;

import com.ems.models.User;
import com.ems.payload.request.SignupRequest;
import com.ems.payload.response.MessageResponse;
import com.ems.repository.HelpRequestRepository;
import com.ems.repository.UserRepository;
import com.ems.security.services.UserDetailsImpl;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class EmployeeController {

  @Autowired private UserRepository userRepository;

  @Autowired private HelpRequestRepository helpRequestRepository;

  @Autowired private PasswordEncoder encoder;

  @GetMapping("/employees")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<User>> getAllEmployees() {
    return ResponseEntity.ok(userRepository.findAll());
  }

  @PostMapping("/employees")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> createEmployee(@RequestBody SignupRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (request.getPhoneNumber() != null) {
      String digits = request.getPhoneNumber().replaceAll("\\D", "");
      if (!digits.isEmpty() && digits.length() < 10) {
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Error: Phone number must be at least 10 digits."));
      }
    }

    User user =
        new User(
            request.getUsername(),
            encoder.encode(request.getPassword()),
            "admin".equalsIgnoreCase(request.getRole())
                ? com.ems.models.Role.ROLE_ADMIN
                : com.ems.models.Role.ROLE_USER,
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            request.getDepartment(),
            request.getPhoneNumber());

    userRepository.save(user);
    return ResponseEntity.ok(new MessageResponse("Employee added successfully!"));
  }

  @DeleteMapping("/employees/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  @Transactional
  public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
    try {
      Optional<User> userOpt = userRepository.findById(id);
      if (!userOpt.isPresent()) {
        return ResponseEntity.notFound().build();
      }

      User user = userOpt.get();
      helpRequestRepository.deleteByUser(user);

      userRepository.delete(user);
      return ResponseEntity.ok(new MessageResponse("Employee deleted successfully!"));
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(new MessageResponse("Error: " + e.getMessage()));
    }
  }

  @GetMapping("/employees/{id}")
  @PreAuthorize("hasRole('ADMIN') or @securityService.isOwner(#id)")
  public ResponseEntity<User> getEmployeeById(@PathVariable Long id) {
    Optional<User> user = userRepository.findById(id);
    return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/employees/{id}")
  @PreAuthorize("hasRole('ADMIN') or @securityService.isOwner(#id)")
  @Transactional
  public ResponseEntity<?> updateEmployee(
      @PathVariable Long id, @RequestBody SignupRequest request) {
    try {
      Optional<User> optionalUser = userRepository.findById(id);
      if (!optionalUser.isPresent()) {
        return ResponseEntity.notFound().build();
      }

      User user = optionalUser.get();
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      boolean isAdmin =
          auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

      if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
        String digits = request.getPhoneNumber().replaceAll("\\D", "");
        if (!digits.isEmpty() && digits.length() < 10) {
          return ResponseEntity.badRequest()
              .body(new MessageResponse("Error: Phone number must be at least 10 digits."));
        }
      }

      if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
      if (request.getLastName() != null) user.setLastName(request.getLastName());
      if (request.getEmail() != null) user.setEmail(request.getEmail());
      if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());

      if (isAdmin) {
        if (request.getUsername() != null
            && !request.getUsername().isEmpty()
            && !user.getUsername().equals(request.getUsername())) {
          if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
          }
          user.setUsername(request.getUsername());
        }
        if (request.getDepartment() != null) {
          user.setDepartment(request.getDepartment());
        }
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
          String requestedRole = request.getRole().toLowerCase();
          if (requestedRole.contains("admin")) {
            user.setRole(com.ems.models.Role.ROLE_ADMIN);
          } else if (requestedRole.contains("user")) {
            user.setRole(com.ems.models.Role.ROLE_USER);
          }
        }
      }

      if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
        user.setPassword(encoder.encode(request.getPassword()));
      }

      userRepository.save(user);
      return ResponseEntity.ok(new MessageResponse("Employee updated successfully!"));
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(new MessageResponse("Error: " + e.getMessage()));
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<User> getProfile() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
    Optional<User> user = userRepository.findById(userDetails.getId());
    return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }
}
