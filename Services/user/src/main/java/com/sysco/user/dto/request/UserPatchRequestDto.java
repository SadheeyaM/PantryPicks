package com.sysco.user.dto.request;

import com.sysco.user.entity.UserRole;
import com.sysco.user.entity.UserStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserPatchRequestDto {
    private String userEmail ;
    private String userFistName ;
    private String userLastName ;
    private String userPhoneNumber ;
    private UserRole userRole ;
    private UserStatus userStatus ;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
