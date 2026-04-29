package com.sysco.user.dto.request;

import lombok.Data;

@Data
public class UserLoginRequestDto {
    private String userEmail;
    private String password;
}