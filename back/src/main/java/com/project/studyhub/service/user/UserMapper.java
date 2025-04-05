package com.project.studyhub.service.user;

import com.project.studyhub.dto.AppUserDto;
import com.project.studyhub.entity.AppUser;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public AppUserDto map(AppUser appUser) {
        return new AppUserDto(appUser.getId(), appUser.getUsername(), appUser.getRole().toString());
    }
}
