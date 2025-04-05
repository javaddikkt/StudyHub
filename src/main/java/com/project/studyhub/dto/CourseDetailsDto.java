package com.project.studyhub.dto;

import java.util.Set;

public class CourseDetailsDto {
    private Long id;
    private String name;
    private String teacherUsername;
    private Set<MaterialDto> materials;
    private Set<String> studentUsernames;

    public CourseDetailsDto(Long id, String name, String teacherUsername, Set<MaterialDto> materials, Set<String> studentUsernames) {
        this.id = id;
        this.name = name;
        this.teacherUsername = teacherUsername;
        this.materials = materials;
        this.studentUsernames = studentUsernames;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeacherUsername() {
        return teacherUsername;
    }

    public void setTeacherUsername(String teacherUsername) {
        this.teacherUsername = teacherUsername;
    }

    public Set<MaterialDto> getMaterials() {
        return materials;
    }

    public void setMaterials(Set<MaterialDto> materials) {
        this.materials = materials;
    }

    public Set<String> getStudentUsernames() {
        return studentUsernames;
    }

    public void setStudentUsernames(Set<String> studentUsernames) {
        this.studentUsernames = studentUsernames;
    }
}
