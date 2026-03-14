package com.ems.repository;

import com.ems.models.HelpRequest;
import com.ems.models.User;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {
  List<HelpRequest> findByUserOrderByIdDesc(User user);

  List<HelpRequest> findAllByOrderByIdDesc();

  @Transactional
  void deleteByUser(User user);
}
