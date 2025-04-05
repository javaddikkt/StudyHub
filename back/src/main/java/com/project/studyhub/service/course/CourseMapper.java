package com.project.studyhub.service.course;

import com.project.studyhub.dto.CourseDetailsDto;
import com.project.studyhub.dto.CourseDto;
import com.project.studyhub.entity.AppUser;
import com.project.studyhub.entity.Course;
import com.project.studyhub.service.material.MaterialMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CourseMapper {
    private final MaterialMapper materialMapper;
    public CourseMapper(MaterialMapper materialMapper) {
        this.materialMapper = materialMapper;
    }

    public CourseDto mapToCourseDto(Course course) {
        return new CourseDto(course.getId(), course.getName());
    }

    public Course map(CourseDto courseDto) {
        Course course = new Course();
        course.setId(courseDto.getId());
        course.setName(courseDto.getName());
        return course;
    }

    public CourseDetailsDto mapToDetailsDto(Course course) {
        return new CourseDetailsDto(
                course.getId(),
                course.getName(),
                course.getTeacher().getUsername(),
                course.getCourseMaterials().stream().map(materialMapper::map).collect(Collectors.toSet()),
                course.getStudents().stream().map(AppUser::getUsername).collect(Collectors.toSet())
        );
    }
}
