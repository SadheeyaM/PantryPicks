package com.sysco.product.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "product", schema="product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @NotNull(message = "Category is required")
    private Integer categoryId;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String productName;

    @NotBlank(message = "Product description is required")
    @Size(max = 500, message = "Product description must not exceed 500 characters")
    private String productDescription;

    @NotNull(message = "Product quantity is required")
    @Min(value = 0, message = "Product quantity must be 0 or more")
    private Integer productQuantity;

    @NotBlank(message = "Product URL is required")
    @Size(max = 255, message = "Product URL must not exceed 255 characters")
    @Pattern(
            regexp = "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",
            message = "Product URL must be a valid URL"
    )
    private String productUrl;

    private LocalDateTime updateAt ;
    private LocalDateTime createdAt ;
}