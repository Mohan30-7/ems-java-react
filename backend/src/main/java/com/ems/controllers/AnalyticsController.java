package com.ems.controllers;

import com.ems.models.User;
import com.ems.repository.HelpRequestRepository;
import com.ems.repository.LeaveRequestRepository;
import com.ems.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

  @Autowired private UserRepository userRepository;

  @Autowired private HelpRequestRepository helpRequestRepository;

  @Autowired private LeaveRequestRepository leaveRequestRepository;

  @GetMapping("/dashboard")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> getDashboardStats() {
    Map<String, Object> stats = new HashMap<>();

    List<User> allUsers = userRepository.findAll();
    long totalUsers = allUsers.size();

    long pendingHelpRequests =
        helpRequestRepository.findAll().stream()
            .filter(r -> "PENDING".equals(r.getStatus()))
            .count();

    long pendingLeaveRequests =
        leaveRequestRepository.findAll().stream()
            .filter(r -> "PENDING".equals(r.getStatus()))
            .count();

    Map<String, Long> departmentCounts =
        allUsers.stream()
            .filter(u -> u.getDepartment() != null && !u.getDepartment().trim().isEmpty())
            .collect(Collectors.groupingBy(User::getDepartment, Collectors.counting()));

    stats.put("totalEmployees", totalUsers);
    stats.put("pendingHelpRequests", pendingHelpRequests);
    stats.put("pendingLeaveRequests", pendingLeaveRequests);
    stats.put("departmentCounts", departmentCounts);

    return ResponseEntity.ok(stats);
  }
}
