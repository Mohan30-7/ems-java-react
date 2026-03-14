package com.ems.security;

import com.ems.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("securityService")
public class SecurityService {
  public boolean isOwner(Long id) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return false;
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof UserDetailsImpl) {
      UserDetailsImpl userDetails = (UserDetailsImpl) principal;
      return userDetails.getId().equals(id);
    }
    return false;
  }
}
