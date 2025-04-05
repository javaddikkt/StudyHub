package com.project.studyhub.repository;

import com.project.studyhub.entity.AppUser;
import com.project.studyhub.entity.Course;
import com.project.studyhub.entity.EnrollmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequest, Long> {
    Optional<List<EnrollmentRequest>> findByCourseId(Long courseId);
    Optional<List<EnrollmentRequest>> findByStudentId(Long studentID);
}
