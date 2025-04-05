package com.project.studyhub.service.enrollment;

import com.project.studyhub.ServiceException;
import com.project.studyhub.dto.EnrollmentRequestDto;
import com.project.studyhub.entity.*;
import com.project.studyhub.repository.CourseRepository;
import com.project.studyhub.repository.EnrollmentRequestRepository;
import com.project.studyhub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRequestRepository enrollmentRequestRepository;
    private final EnrollmentMapper enrollmentMapper;

    public EnrollmentService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRequestRepository enrollmentRequestRepository,
            EnrollmentMapper enrollmentMapper) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRequestRepository = enrollmentRequestRepository;
        this.enrollmentMapper = enrollmentMapper;
    }

    @Transactional
    public EnrollmentRequestDto inviteStudent(Long courseID, String username) {
        Course course = courseRepository
                .findById(courseID)
                .orElseThrow(() -> new ServiceException(String.format("Course with id %d not found", courseID)));

        AppUser user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ServiceException(String.format("Student %s not found", username)));

        if (user.getRole() != UserRole.STUDENT) {
            throw new ServiceException(String.format("User %s is not a student", username));
        }

        EnrollmentRequest request = new EnrollmentRequest();
        request.setCourse(course);
        request.setStudent(user);
        request.setStatus(EnrollmentRequest.Status.PENDING);
        enrollmentRequestRepository.save(request);
        return enrollmentMapper.map(request);
    }

    public void confirmEnrollment(Long enrollmentRequestID, Long userId) {
        EnrollmentRequest request = enrollmentRequestRepository
                .findById(enrollmentRequestID)
                .orElseThrow(() -> new ServiceException(String.format("Enrollment request with id %d not found", enrollmentRequestID)));
        if (!request.getStudent().getId().equals(userId)) {
            throw new ServiceException("Enrollment request does not belong to student");
        }
        request.setStatus(EnrollmentRequest.Status.APPROVED);
        enrollmentRequestRepository.save(request);

        AppUser student = request.getStudent();
        Course course = request.getCourse();
        course.getStudents().add(student);
        courseRepository.save(course);
    }

    public EnrollmentRequestDto findById(Long enrollmentRequestID) {
        EnrollmentRequest request = enrollmentRequestRepository
                .findById(enrollmentRequestID)
                .orElseThrow(() -> new ServiceException(String.format("Enrollment request with id %d not found", enrollmentRequestID)));
        return enrollmentMapper.map(request);
    }

    public List<EnrollmentRequestDto> findByCourseId(Long courseID) {
        return convertToDto(
                enrollmentRequestRepository
                .findByCourseId(courseID)
                .orElse(List.of())
        );
    }

    public List<EnrollmentRequestDto> findByStudentId(Long studentID) {
        return convertToDto(
                enrollmentRequestRepository
                .findByStudentId(studentID)
                .orElse(List.of())
        );
    }

    private List<EnrollmentRequestDto> convertToDto(List<EnrollmentRequest> enrollmentRequests) {
        return enrollmentRequests
                .stream()
                .filter(request -> request.getStatus()== EnrollmentRequest.Status.PENDING)
                .map(enrollmentMapper::map)
                .toList();
    }

}
