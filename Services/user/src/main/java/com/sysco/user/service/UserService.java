package com.sysco.user.service;


import com.sysco.user.dto.request.UserCreateRequestDto;
import com.sysco.user.dto.request.UserFilterRequestDto;
import com.sysco.user.dto.request.UserLoginRequestDto;
import com.sysco.user.dto.request.UserPatchRequestDto;
import com.sysco.user.dto.response.ResponseObject;
import com.sysco.user.dto.response.UserResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;

public interface UserService {
    ResponseObject createUser(UserCreateRequestDto userCreateRequestDto);

    ResponseObject signup(UserCreateRequestDto userCreateRequestDto);

    ResponseObject login(UserLoginRequestDto userLoginRequestDto);

    List<UserResponseDto> getAllUsers() ;

    ResponseObject getUserById(Integer userId) ;

    ResponseObject updateUserDetails (Integer userId, UserPatchRequestDto userPatchRequestDto) ;
}
