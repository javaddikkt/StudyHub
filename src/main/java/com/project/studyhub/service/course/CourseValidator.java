package com.project.studyhub.service.course;

import com.project.studyhub.ServiceException;
import com.project.studyhub.entity.AppUser;
import com.project.studyhub.entity.UserRole;
import org.springframework.stereotype.Component;

@Component
public class CourseValidator {
    public void checkIsTeacher(AppUser user) {
        if (user == null) {
            throw new ServiceException("User is null");
        }
        if (!user.getRole().equals(UserRole.TEACHER)) {
            throw new ServiceException("User is not teacher");
        }
    }
}
