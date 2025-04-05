package com.project.studyhub.dto;

public class EnrollmentRequestDto {
    private Long id;
    private Long studentId;
    private String courseName;
    private String status;

    public EnrollmentRequestDto(Long id, Long studentId, String courseName, String status) {
        this.id = id;
        this.studentId = studentId;
        this.courseName = courseName;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
