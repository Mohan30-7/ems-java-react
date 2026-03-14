package com.ems.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  private String firstName;
  private String lastName;
  private String email;
  private String department;
  private String phoneNumber;

  private String resetToken;
  private LocalDateTime resetTokenExpiry;

  public User(
      String username,
      String password,
      Role role,
      String firstName,
      String lastName,
      String email,
      String department,
      String phoneNumber) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.department = department;
    this.phoneNumber = phoneNumber;
  }
}
