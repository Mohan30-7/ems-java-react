package com.ems.repository;

import com.ems.models.Attendance;
import com.ems.models.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
  List<Attendance> findByUserOrderByDateDesc(User user);

  Optional<Attendance> findByUserAndDate(User user, LocalDate date);

  List<Attendance> findByDate(LocalDate date);

  List<Attendance> findAllByOrderByDateDesc();
}
