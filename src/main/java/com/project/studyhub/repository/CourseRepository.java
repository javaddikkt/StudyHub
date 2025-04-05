package com.project.studyhub.repository;

import com.project.studyhub.entity.Course;
import com.project.studyhub.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<List<Course>> findByTeacher(AppUser teacher);

}
