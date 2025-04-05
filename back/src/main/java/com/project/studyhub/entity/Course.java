package com.project.studyhub.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    private AppUser teacher;

    @ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinTable(
            name = "enrolled_courses",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<AppUser> students;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "course_id")
    private Set<Material> materials;

    public Course() {
        super();
    }

    public Course(Long id, String name, AppUser teacher) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
        students = new HashSet<>();
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

    public AppUser getTeacher() {
        return teacher;
    }

    public void setTeacher(AppUser teacher) {
        this.teacher = teacher;
    }

    public Set<AppUser> getStudents() {
        return students;
    }

    public void setStudents(Set<AppUser> students) {
        this.students = students;
    }

    public Set<Material> getCourseMaterials() {
        return materials;
    }

    public void setCourseMaterials(Set<Material> materials) {
        this.materials = materials;
    }
}
