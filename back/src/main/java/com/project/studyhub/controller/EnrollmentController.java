package com.project.studyhub.controller;

import com.project.studyhub.dto.EnrollmentRequestDto;
import com.project.studyhub.service.enrollment.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/requests")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentRequestDto>> getRequests(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(enrollmentService.findByStudentId(userId));
    }

    @GetMapping("/{courseID}")
    public ResponseEntity<List<EnrollmentRequestDto>> getCourseRequests(@PathVariable Long courseID) {
        return ResponseEntity.ok(enrollmentService.findByCourseId(courseID));
    }

    @PostMapping("/{courseID}/invite")
    public ResponseEntity<EnrollmentRequestDto> inviteStudent(@PathVariable Long courseID, @RequestBody String username) {
        return ResponseEntity.ok(enrollmentService.inviteStudent(courseID, username));
    }

    @PostMapping("/{requestID}/confirm")
    public ResponseEntity<String> confirmRequest(@PathVariable Long requestID, @AuthenticationPrincipal Long userId) {
        enrollmentService.confirmEnrollment(requestID, userId);
        return ResponseEntity.ok("Your enrollment has been confirmed.");
    }
}
