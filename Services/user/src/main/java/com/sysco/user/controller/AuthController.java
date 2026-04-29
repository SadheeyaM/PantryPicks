package com.sysco.user.controller;

import com.sysco.user.dto.request.UserCreateRequestDto;
import com.sysco.user.dto.request.UserLoginRequestDto;
import com.sysco.user.dto.response.ResponseObject;
import com.sysco.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users/auth")
public class AuthController extends AbstractController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ResponseObject> signup(@RequestBody UserCreateRequestDto requestDto) {
        log.info("Signup request for email: {}", requestDto.getUserEmail());
        return sendCreatedResponse(userService.signup(requestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody UserLoginRequestDto requestDto) {
        log.info("Login request for email: {}", requestDto.getUserEmail());
        return sendSuccessResponse(userService.login(requestDto));
    }
}