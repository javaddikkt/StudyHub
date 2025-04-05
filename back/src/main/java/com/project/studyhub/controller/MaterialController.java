package com.project.studyhub.controller;

import com.project.studyhub.dto.MaterialDto;
import com.project.studyhub.entity.MaterialType;
import com.project.studyhub.service.course.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Controller
@RequestMapping("/api/materials")
public class MaterialController {
    private final CourseService courseService;

    @Autowired
    public MaterialController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/{courseID}")
    public ResponseEntity<List<MaterialDto>> getMaterials(@PathVariable Long courseID) {
        return ResponseEntity.ok(courseService.getMaterials(courseID));
    }

    @PostMapping("/{courseID}/upload")
    public ResponseEntity<?> uploadMaterial(@PathVariable Long courseID,
                                            @RequestParam("title") String title,
                                            @RequestParam("type") MaterialType type,
                                            @RequestParam(value = "data", required = false) String data,
                                            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        courseService.addMaterial(courseID, title, type, data, file);
        return ResponseEntity.ok("Material uploaded successfully");
    }

    @GetMapping("/{courseID}/download/{filename}")
    public ResponseEntity<Resource> download(@PathVariable Long courseID, @PathVariable String filename, @AuthenticationPrincipal Long userId) {
        Resource file = courseService.loadMaterial(courseID, filename, userId);
        String contentType;
        try {
            contentType = Files.probeContentType(Path.of(file.getFile().getAbsolutePath()));
        } catch (IOException e) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

}
