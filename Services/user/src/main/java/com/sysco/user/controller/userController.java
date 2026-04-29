package com.sysco.user.controller;

import com.sysco.user.dto.error.ErrorDto;
import com.sysco.user.dto.request.UserCreateRequestDto;
import com.sysco.user.dto.request.UserFilterRequestDto;
import com.sysco.user.dto.request.UserPatchRequestDto;
import com.sysco.user.dto.response.ResponseObject;
import com.sysco.user.dto.response.UserResponseDto;
import com.sysco.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
//import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//import org.hibernate.annotations.Parameter;
//import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/v1/users")
public class userController extends AbstractController{
//    public final AbstractController abstractController ;
    public final UserService userService ;

    @PostMapping
    public ResponseEntity<ResponseObject> createUser(@RequestBody UserCreateRequestDto userCreateRequestDto) {
        log.info("Creating user profile for email: {}", userCreateRequestDto.getUserEmail());
        return sendCreatedResponse(userService.createUser(userCreateRequestDto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllUsers() {
        log.info("Fetching all users");
        return sendSuccessResponse(userService.getAllUsers()) ;

    }

    @GetMapping("/{id}")
    @Operation()
    @ApiResponses()
    public ResponseEntity<ResponseObject> getUserById(@PathVariable Integer id) {
        log.info("Fetching User By Id: {}", id) ;

        return sendSuccessResponse(
                userService.getUserById(id)
        ) ;
    }

    @PatchMapping("/{id}")
    @Operation()
    @ApiResponses()
    public ResponseEntity<ResponseObject> updateUserDetails(@PathVariable Integer id, @RequestBody UserPatchRequestDto userPatchRequestDto) {
        log.info("Update User detail of User Id {}", id);

        return sendSuccessResponse(userService.updateUserDetails(id, userPatchRequestDto)) ;
    }
}
