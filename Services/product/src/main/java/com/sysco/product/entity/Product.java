package com.sysco.product.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
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

    @NotBlank(message = "Supplier ID is required")
    @Size(max = 50, message = "Supplier ID must not exceed 50 characters")
    private String supplierId;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String productName;

    @NotBlank(message = "Product description is required")
    @Size(max = 500, message = "Product description must not exceed 500 characters")
    private String productDescription;

    @NotNull(message = "Product quantity is required")
    @Min(value = 0, message = "Product quantity must be 0 or more")
    private Integer productQuantity;

    @NotNull(message = "Product price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Product price must be 0 or more")
    private BigDecimal price;

    @NotBlank(message = "Product status is required")
    @Size(max = 50, message = "Product status must not exceed 50 characters")
    private String productStatus;

    @NotBlank(message = "Unit of selling is required")
    @Size(max = 50, message = "Unit of selling must not exceed 50 characters")
    private String unitOfSelling;

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