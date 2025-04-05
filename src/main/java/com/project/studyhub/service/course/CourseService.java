package com.project.studyhub.service.course;

import com.project.studyhub.ServiceException;
import com.project.studyhub.dto.CourseDetailsDto;
import com.project.studyhub.dto.CourseDto;
import com.project.studyhub.dto.MaterialDto;
import com.project.studyhub.entity.*;
import com.project.studyhub.repository.CourseRepository;
import com.project.studyhub.repository.MaterialsRepository;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.service.material.FileStorageService;
import com.project.studyhub.service.material.MaterialMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseValidator courseValidator;
    private final CourseMapper courseMapper;
    private final MaterialMapper materialMapper;
    private final FileStorageService fileStorageService;
    private final MaterialsRepository materialsRepository;
    private final UserRepository userRepository;

    @Autowired
    public CourseService(
            CourseRepository courseRepository,
            CourseValidator courseValidator,
            CourseMapper courseMapper, MaterialMapper materialMapper, FileStorageService fileStorageService, MaterialsRepository materialsRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.courseValidator = courseValidator;
        this.courseMapper = courseMapper;
        this.materialMapper = materialMapper;
        this.fileStorageService = fileStorageService;
        this.materialsRepository = materialsRepository;
        this.userRepository = userRepository;
    }

    private Predicate<Course> studentInCourse(AppUser student) {
        return course -> course
                .getStudents()
                .stream()
                .anyMatch(user -> user.equals(student));
    }

    private Predicate<Course> teacherInCourse(AppUser teacher) {
        return course -> course
                .getTeacher()
                .equals(teacher);
    }

    public Set<CourseDto> getAllCourses(AppUser user) {
        return courseRepository
                .findAll()
                .stream()
                .filter(
                        user.getRole() == UserRole.STUDENT
                        ? studentInCourse(user)
                        : teacherInCourse(user)
                )
                .map(courseMapper::mapToCourseDto)
                .collect(Collectors.toSet());
    }

    public CourseDto getCourse(Long id) {
        return courseMapper.mapToCourseDto(courseRepository
                .findById(id)
                .orElseThrow(() -> new ServiceException(String.format("Course with id %d not found", id)))
        );
    }

    public CourseDetailsDto getCourseDetails(Long id) {
        return courseMapper.mapToDetailsDto(courseRepository
                .findById(id)
                .orElseThrow(() -> new ServiceException(String.format("Course with id %d not found", id)))
        );
    }

    @Transactional
    public CourseDto save(CourseDto course, AppUser user) {
        courseValidator.checkIsTeacher(user);
        Course newCourse = courseMapper.map(course);
        newCourse.setTeacher(user);
        newCourse.setStudents(new HashSet<>());
        newCourse.setCourseMaterials(new HashSet<>());
        return courseMapper.mapToCourseDto(courseRepository.save(newCourse));
    }

    @Transactional
    public void addMaterial(Long courseId, String title, MaterialType type, String data, MultipartFile file) {
        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() -> new ServiceException(String.format("Course with id %d not found", courseId)));


        String path = "";
        if (type == MaterialType.FILE) {
            if (file == null || file.isEmpty()) {
                throw new ServiceException("File is empty or null");
            }
            try {
                path = fileStorageService.save(file);
            } catch (IOException e) {
                throw new ServiceException("Couldn't save file");
            }
        } else {
            if (data == null || data.isEmpty()) {
                throw new ServiceException("Material is empty or null");
            }
        }

        Material material = new Material();
        material.setTitle(title);
        material.setType(type);
        material.setData(path.isEmpty() ? data : path);

        course.getCourseMaterials().add(material);
        courseRepository.save(course);
    }

    public Resource loadMaterial(Long courseId, String filename, Long userId) {
        materialsRepository.findByData(filename)
                .orElseThrow(() -> new ServiceException("Material not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ServiceException("Course not found"));

        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ServiceException("User not found"));

        if (!course.getStudents().contains(user) && !course.getTeacher().getId().equals(userId)) {
            throw new ServiceException("Access to course material is denied");
        }
        return fileStorageService.load(filename);
    }

    public List<MaterialDto> getMaterials(Long courseId) {
        return (courseRepository
                .findById(courseId)
                .orElseThrow(() -> new ServiceException(String.format("Course with id %d not found", courseId))))
                .getCourseMaterials()
                .stream()
                .map(materialMapper::map)
                .collect(Collectors.toList());
    }


}
