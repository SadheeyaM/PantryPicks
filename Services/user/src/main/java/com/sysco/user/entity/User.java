package com.sysco.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId ;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Column(unique = true)
    private String userEmail ;

    @NotBlank(message = "Password hash is required")
    private String passwordHash;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String userFistName ;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String userLastName ;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Phone number must be valid")
    private String userPhoneNumber ;

    @NotNull(message = "User role is required")
    @Enumerated(EnumType.STRING)
    private UserRole userRole ;

    @NotNull(message = "User status is required")
    @Enumerated(EnumType.STRING)
    private UserStatus userStatus ;

    @NotNull
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
