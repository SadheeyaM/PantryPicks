package com.sysco.user.service.implementation;

import com.sysco.user.dto.request.UserCreateRequestDto;
import com.sysco.user.dto.request.UserLoginRequestDto;
import com.sysco.user.dto.request.UserPatchRequestDto;
import com.sysco.user.exception.UserException;
import com.sysco.user.dto.response.ResponseObject;
import com.sysco.user.dto.response.UserResponseDto;
import com.sysco.user.entity.User;
import com.sysco.user.entity.UserRole;
import com.sysco.user.entity.UserStatus;
import com.sysco.user.repository.UserRepository;
import com.sysco.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

import static com.sysco.user.mapper.UserMapper.mapToUserResponseList;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ResponseObject createUser(UserCreateRequestDto userCreateRequestDto) {
        validateCreateRequest(userCreateRequestDto);

        if (userRepository.findByUserEmailIgnoreCase(userCreateRequestDto.getUserEmail()).isPresent()) {
            throw new UserException("CONFLICT", "User with this email already exists", HttpStatus.CONFLICT);
        }

        User user = buildUser(userCreateRequestDto);
        User savedUser = userRepository.save(user);

        ResponseObject response = new ResponseObject();
        response.setData(savedUser);
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public ResponseObject signup(UserCreateRequestDto userCreateRequestDto) {
        return createUser(userCreateRequestDto);
    }

    @Override
    public ResponseObject login(UserLoginRequestDto userLoginRequestDto) {
        if (userLoginRequestDto == null || !StringUtils.hasText(userLoginRequestDto.getUserEmail()) || !StringUtils.hasText(userLoginRequestDto.getPassword())) {
            throw new UserException("VALIDATION_ERROR", "userEmail and password are required", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByUserEmailIgnoreCase(userLoginRequestDto.getUserEmail())
                .orElseThrow(() -> new UserException("UNAUTHORIZED", "Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(userLoginRequestDto.getPassword(), user.getPasswordHash())) {
            throw new UserException("UNAUTHORIZED", "Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        ResponseObject response = new ResponseObject();
        response.setData(user);
        response.setStatus(HttpStatus.OK);
        return response;
    }


    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return mapToUserResponseList(users) ;
    }

    @Override
    public ResponseObject getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(
                        "NOT_FOUND",
                        "User with id " + userId + " not found",
                        HttpStatus.NOT_FOUND));

        ResponseObject response = new ResponseObject();

        response.setData(user);
        response.setStatus(HttpStatus.OK);

        return response;
    }

    @Override
    public ResponseObject updateUserDetails(Integer userId, UserPatchRequestDto userPatchRequestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(
                        "NOT_FOUND",
                        "User with id " + userId + " not found",
                        HttpStatus.NOT_FOUND
                ));

        if (userPatchRequestDto.getUserEmail() != null) {
            user.setUserEmail(userPatchRequestDto.getUserEmail());
        }

        if (userPatchRequestDto.getUserPhoneNumber() != null) {
            user.setUserPhoneNumber(userPatchRequestDto.getUserPhoneNumber());
        }

        if (userPatchRequestDto.getUserFistName() != null) {
            user.setUserFistName(userPatchRequestDto.getUserFistName());
        }

        if (userPatchRequestDto.getUserLastName() != null) {
            user.setUserLastName(userPatchRequestDto.getUserLastName());
        }

        if (userPatchRequestDto.getUserRole() != null) {
            user.setUserRole(userPatchRequestDto.getUserRole());
        }

        if (userPatchRequestDto.getUserStatus() != null) {
            user.setUserStatus(userPatchRequestDto.getUserStatus());
        }

        if (userPatchRequestDto.getCreatedAt() != null) {
            user.setCreatedAt(userPatchRequestDto.getCreatedAt());
        }

        user.setUpdatedAt(LocalDateTime.now());

        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new UserException(
                    "DATABASE_ERROR",
                    "Failed TO Update User",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        ResponseObject responseObject = new ResponseObject();

        responseObject.setData(user);
        responseObject.setStatus(HttpStatus.OK);

        return responseObject;
    }

    private void validateCreateRequest(UserCreateRequestDto request) {
        if (request == null
                || !StringUtils.hasText(request.getUserEmail())
                || !StringUtils.hasText(request.getPassword())
                || !StringUtils.hasText(request.getUserFistName())
                || !StringUtils.hasText(request.getUserLastName())
                || !StringUtils.hasText(request.getUserPhoneNumber())) {
            throw new UserException(
                    "VALIDATION_ERROR",
                    "userEmail, password, userFistName, userLastName, and userPhoneNumber are required",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private User buildUser(UserCreateRequestDto request) {
        User user = new User();
        user.setUserEmail(request.getUserEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserFistName(request.getUserFistName());
        user.setUserLastName(request.getUserLastName());
        user.setUserPhoneNumber(request.getUserPhoneNumber());
        user.setUserRole(request.getUserRole() != null ? request.getUserRole() : UserRole.USER);
        user.setUserStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }
}