package com.project.studyhub.dto;

import java.util.Set;

public class CourseDetailsDto {
    private Long id;
    private String title;
    private String teacherUsername;
    private Set<String> studentUsernames;

    public CourseDetailsDto(Long id, String title, String teacherUsername, Set<String> studentUsernames) {
        this.id = id;
        this.title = title;
        this.teacherUsername = teacherUsername;
        this.studentUsernames = studentUsernames;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTeacherUsername() {
        return teacherUsername;
    }

    public void setTeacherUsername(String teacherUsername) {
        this.teacherUsername = teacherUsername;
    }

    public Set<String> getStudentUsernames() {
        return studentUsernames;
    }

    public void setStudentUsernames(Set<String> studentUsernames) {
        this.studentUsernames = studentUsernames;
    }
}
