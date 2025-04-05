package com.project.studyhub.service.enrollment;

import com.project.studyhub.dto.EnrollmentRequestDto;
import com.project.studyhub.entity.EnrollmentRequest;
import org.springframework.stereotype.Component;

@Component
public class EnrollmentMapper {
    public EnrollmentRequestDto map (EnrollmentRequest enrollmentRequest) {
        return new EnrollmentRequestDto(
                enrollmentRequest.getId(),
                enrollmentRequest.getStudent().getId(),
                enrollmentRequest.getCourse().getName(),
                enrollmentRequest.getStatus().toString()
        );
    }
}
