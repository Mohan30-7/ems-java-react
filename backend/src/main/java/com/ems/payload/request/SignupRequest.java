package com.ems.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
  private String username;
  private String password;
  private String firstName;
  private String lastName;
  private String email;
  private String department;
  private String phoneNumber;
  private String role;
}
