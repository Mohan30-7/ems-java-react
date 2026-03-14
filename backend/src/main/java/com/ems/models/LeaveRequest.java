package com.ems.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private User user;

  private LocalDate startDate;

  private LocalDate endDate;

  private String leaveType;

  private String reason;

  private String status;

  private LocalDateTime createdAt;

  private String adminReply;

  private String repliedByAdmin;

  public LeaveRequest() {}

  public LeaveRequest(
      User user,
      LocalDate startDate,
      LocalDate endDate,
      String leaveType,
      String reason,
      String status) {
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
    this.leaveType = leaveType;
    this.reason = reason;
    this.status = status;
    this.createdAt = LocalDateTime.now();
  }

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public LocalDate getEndDate() {
    return endDate;
  }

  public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
  }

  public String getLeaveType() {
    return leaveType;
  }

  public void setLeaveType(String leaveType) {
    this.leaveType = leaveType;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public String getAdminReply() {
    return adminReply;
  }

  public void setAdminReply(String adminReply) {
    this.adminReply = adminReply;
  }

  public String getRepliedByAdmin() {
    return repliedByAdmin;
  }

  public void setRepliedByAdmin(String repliedByAdmin) {
    this.repliedByAdmin = repliedByAdmin;
  }
}
