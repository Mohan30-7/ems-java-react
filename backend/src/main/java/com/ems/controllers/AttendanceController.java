package com.ems.controllers;

import com.ems.models.Attendance;
import com.ems.models.User;
import com.ems.payload.response.MessageResponse;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.UserRepository;
import com.ems.security.services.UserDetailsImpl;
import java.time.LocalDate;
import java.time.LocalTime;
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
@RequestMapping("/api/attendance")
public class AttendanceController {

  @Autowired private AttendanceRepository attendanceRepository;

  @Autowired private UserRepository userRepository;

  private User getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return null;
    }
    UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
    return userRepository.findById(userDetails.getId()).orElse(null);
  }

  @PostMapping("/check-in")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> checkIn() {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }

    LocalDate today = LocalDate.now();
    Optional<Attendance> existingAttendance = attendanceRepository.findByUserAndDate(user, today);

    if (existingAttendance.isPresent()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Already checked in for today"));
    }

    Attendance attendance = new Attendance(user, today, LocalTime.now(), "PRESENT");
    attendanceRepository.save(attendance);

    return ResponseEntity.ok(
        new MessageResponse("Checked in successfully at " + attendance.getCheckInTime()));
  }

  @PostMapping("/check-out")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> checkOut() {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
    }

    LocalDate today = LocalDate.now();
    Optional<Attendance> existingAttendanceOpt =
        attendanceRepository.findByUserAndDate(user, today);

    if (!existingAttendanceOpt.isPresent()) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("No check-in record found for today"));
    }

    Attendance attendance = existingAttendanceOpt.get();
    if (attendance.getCheckOutTime() != null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Already checked out for today"));
    }

    attendance.setCheckOutTime(LocalTime.now());

    long hours =
        java.time.Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime())
            .toHours();
    if (hours >= 8) {
      attendance.setStatus("PRESENT");
    } else {
      attendance.setStatus("ABSENT");
    }

    attendanceRepository.save(attendance);

    return ResponseEntity.ok(
        new MessageResponse("Checked out successfully (Status: " + attendance.getStatus() + ")"));
  }

  @GetMapping("/my")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<List<Attendance>> getMyAttendance() {
    User user = getCurrentUser();
    if (user == null) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok(attendanceRepository.findByUserOrderByDateDesc(user));
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<Attendance>> getAllAttendance() {
    return ResponseEntity.ok(attendanceRepository.findAllByOrderByDateDesc());
  }
}
