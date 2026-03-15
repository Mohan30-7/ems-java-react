package com.ems.controllers;

import com.ems.models.Role;
import com.ems.models.User;
import com.ems.payload.request.ForgotPasswordRequest;
import com.ems.payload.request.LoginRequest;
import com.ems.payload.request.ResetPasswordRequest;
import com.ems.payload.request.SignupRequest;
import com.ems.payload.response.JwtResponse;
import com.ems.payload.response.MessageResponse;
import com.ems.repository.UserRepository;
import com.ems.security.jwt.JwtUtils;
import com.ems.security.services.UserDetailsImpl;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

  @Autowired AuthenticationManager authenticationManager;

  @Autowired UserRepository userRepository;

  @Autowired PasswordEncoder encoder;

  @Autowired JwtUtils jwtUtils;

  @Value("${ems.frontend.url:http://localhost:5173}")
  private String frontendUrl;

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    logger.info("Login request received for user: {}", loginRequest.getUsername());
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      String jwt = jwtUtils.generateJwtToken(authentication);

      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
      String role = userDetails.getAuthorities().iterator().next().getAuthority();

      logger.info("Login successful for user: {}", loginRequest.getUsername());
      return ResponseEntity.ok(
          new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), role));
    } catch (Exception e) {
      logger.error("Login failed for user: {}, Error: {}", loginRequest.getUsername(), e.getMessage());
      throw e;
    }
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (signUpRequest.getPhoneNumber() != null) {
      String digits = signUpRequest.getPhoneNumber().replaceAll("\\D", "");
      if (!digits.isEmpty() && digits.length() < 10) {
        return ResponseEntity.badRequest()
            .body(new MessageResponse("Error: Phone number must be at least 10 digits."));
      }
    }

    Role role = Role.ROLE_USER;

    User user =
        new User(
            signUpRequest.getUsername(),
            encoder.encode(signUpRequest.getPassword()),
            role,
            signUpRequest.getFirstName(),
            signUpRequest.getLastName(),
            signUpRequest.getEmail(),
            signUpRequest.getDepartment(),
            signUpRequest.getPhoneNumber());

    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
    if (!userOpt.isPresent()) {
      return ResponseEntity.ok(
          new MessageResponse("If the email exists, a reset link will be sent."));
    }

    User user = userOpt.get();
    String token = UUID.randomUUID().toString();
    user.setResetToken(token);
    user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
    userRepository.save(user);

    String resetLink = frontendUrl + "/reset-password?token=" + token;
    System.out.println("\n\n=== PASSWORD RESET EMAIL (MOCK) ===");
    System.out.println("To: " + user.getEmail());
    System.out.println("Subject: Password Reset Request");
    System.out.println("Click the link below to reset your password:");
    System.out.println(resetLink);
    System.out.println("===============================\n\n");

    return ResponseEntity.ok(
        new MessageResponse("If the email exists, a reset link will be sent."));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    Optional<User> userOpt = userRepository.findByResetToken(request.getToken());
    if (!userOpt.isPresent()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired token."));
    }

    User user = userOpt.get();
    if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired token."));
    }

    user.setPassword(encoder.encode(request.getNewPassword()));
    user.setResetToken(null);
    user.setResetTokenExpiry(null);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Password successfully reset!"));
  }
}
