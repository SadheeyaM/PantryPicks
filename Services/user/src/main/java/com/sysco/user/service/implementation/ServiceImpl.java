package com.sysco.user.service.implementation;

import com.sysco.user.dto.request.UserPatchRequestDto;
import com.sysco.user.exception.UserException;
import com.sysco.user.exception.UserNotFoundException;
import com.sysco.user.service.UserService ;
import com.sysco.user.dto.request.UserFilterRequestDto;
import com.sysco.user.dto.response.ResponseObject;
import com.sysco.user.dto.response.UserResponseDto;
import com.sysco.user.repository.UserRepository;
import com.sysco.user.service.UserService;
import com.sysco.user.entity.User ;
import com.sysco.user.specification.UserSpecification ;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.sysco.user.mapper.UserMapper.mapToUserResponseList;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements UserService {
    private final UserRepository userRepository ;


    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return mapToUserResponseList(users) ;
    }

    @Override
    public  ResponseObject getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(
                        "NOT_FOUND",
                        "User with id " + userId + " not found",
                        HttpStatus.NOT_FOUND)) ;

        ResponseObject response = new ResponseObject() ;

        response.setData(user);
        response.setStatus(HttpStatus.OK);

        return response;
    }

    @Override
    public  ResponseObject updateUserDetails (Integer userId, UserPatchRequestDto userPatchRequestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(
                        "NOT_FOUND",
                        "User with id " + userId + " not found",
                        HttpStatus.NOT_FOUND
                )) ;

        if (userPatchRequestDto.getUserEmail() != null) {
            user.setUserEmail(userPatchRequestDto.getUserEmail());
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
        }catch (Exception e) {
            throw new UserException(
                    "DATABASE_ERROR",
                    "Failed TO Update User",
                    HttpStatus.INTERNAL_SERVER_ERROR
            ) ;
        }

        ResponseObject responseObject = new ResponseObject() ;

        responseObject.setData(user);
        responseObject.setStatus(HttpStatus.OK);

        return responseObject ;
    }
}