package com.project.studyhub.service.user;

import com.project.studyhub.ServiceException;
import com.project.studyhub.dto.AppUserDto;
import com.project.studyhub.dto.RegistrationRequest;
import com.project.studyhub.entity.*;
import com.project.studyhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Autowired
    public UserService(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return new User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(getAuthority(user)))
        );
    }

    private String getAuthority(AppUser user) {
        return "ROLE_".concat(user.getRole().toString());
    }

    public AppUser findById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new ServiceException(String.format("User with id %d not found", id)));
    }

    public AppUser findByUsername(String username) {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ServiceException(String.format("User %s not found", username)));
    }

    public boolean isPresent(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public List<AppUserDto> findAll() {
        return userRepository.findAll().stream().map(userMapper::map).collect(Collectors.toList());
    }

    @Transactional
    public AppUserDto create(RegistrationRequest request) {
        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setRole(switch (request.getRole()) {
            case "STUDENT" -> UserRole.STUDENT;
            case "TEACHER" -> UserRole.TEACHER;
            default -> throw new ServiceException("Invalid role");
        });
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userMapper.map(userRepository.save(user));
    }

}
