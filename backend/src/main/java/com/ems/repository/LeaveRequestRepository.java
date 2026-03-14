package com.ems.repository;

import com.ems.models.LeaveRequest;
import com.ems.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
  List<LeaveRequest> findByUserOrderByCreatedAtDesc(User user);

  List<LeaveRequest> findAllByOrderByCreatedAtDesc();
}
