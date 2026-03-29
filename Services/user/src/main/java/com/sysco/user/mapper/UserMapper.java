package com.sysco.user.mapper;

import com.sysco.user.dto.response.UserResponseDto;
import com.sysco.user.entity.User;
import com.sysco.user.entity.UserRole;
import com.sysco.user.entity.UserStatus;
import lombok.experimental.UtilityClass;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class UserMapper {

    public static UserResponseDto mapToUserResponse(User user) {
        UserResponseDto userResponseDto = new UserResponseDto() ;

        userResponseDto.setUserId(user.getUserId()) ;
        userResponseDto.setUserEmail(user.getUserEmail());
        userResponseDto.setUserFistName(user.getUserFistName());
        userResponseDto.setUserLastName(user.getUserLastName());
        userResponseDto.setUserPhoneNumber(user.getUserPhoneNumber());
        userResponseDto.setUserStatus(user.getUserStatus());
        userResponseDto.setUserRole(user.getUserRole());
        userResponseDto.setCreatedAt(user.getCreatedAt());
        userResponseDto.setUpdatedAt(user.getUpdatedAt());

        return userResponseDto ;
    }

    public static List<UserResponseDto> mapToUserResponseList(List<User> users) {
        return users.stream()
                .map(UserMapper:: mapToUserResponse)
                .collect(Collectors.toList()) ;
    }

}
