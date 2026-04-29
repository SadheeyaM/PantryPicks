package com.sysco.user.dto.request;

import com.sysco.user.entity.UserRole;
import lombok.Data;

@Data
public class UserCreateRequestDto {
	private String userEmail;
	private String password;
	private String userFistName;
	private String userLastName;
	private String userPhoneNumber;
	private UserRole userRole;
}
