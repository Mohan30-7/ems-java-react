package com.ems.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendances")
public class Attendance {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private User user;

  private LocalDate date;

  private LocalTime checkInTime;

  private LocalTime checkOutTime;

  private String status;

  public Attendance() {}

  public Attendance(User user, LocalDate date, LocalTime checkInTime, String status) {
    this.user = user;
    this.date = date;
    this.checkInTime = checkInTime;
    this.status = status;
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

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public LocalTime getCheckInTime() {
    return checkInTime;
  }

  public void setCheckInTime(LocalTime checkInTime) {
    this.checkInTime = checkInTime;
  }

  public LocalTime getCheckOutTime() {
    return checkOutTime;
  }

  public void setCheckOutTime(LocalTime checkOutTime) {
    this.checkOutTime = checkOutTime;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
