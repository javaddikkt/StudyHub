package com.project.studyhub.controller;

import com.project.studyhub.dto.CourseDto;
import com.project.studyhub.service.course.CourseService;
import com.project.studyhub.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;
    private final UserService userService;

    @Autowired
    public CourseController(UserService userService, CourseService courseService) {
        this.userService = userService;
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<Set<CourseDto>> getCourses(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(courseService.getAllCourses(userService.findById(userId)));
    }

    @GetMapping("/{courseID}")
    public ResponseEntity<CourseDto> getById(@PathVariable Long courseID) {
        return ResponseEntity.ok(courseService.getCourse(courseID));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCourse(@RequestBody CourseDto course, @AuthenticationPrincipal Long userId) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(courseService.save(course, userService.findById(userId)));
    }
}
