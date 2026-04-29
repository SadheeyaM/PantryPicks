package com.sysco.product.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDto {
    @NotBlank(message = "product name is required")
    @Size(max = 255, message = "product name must not exceed 255 characters")
    private String productName;

    @NotNull(message = "Category ID is required")
    private Integer categoryId ;

    @NotBlank(message = "Supplier ID is required")
    @Size(max = 50, message = "Supplier ID must not exceed 50 characters")
    private String supplierId;

    @NotBlank(message = "product description is required")
    @Size(max = 255, message = "product description must not exceed 255 characters")
    private String productDescription;

    @NotNull(message = "product quantity is required")
    @Min(value = 0, message = "product quantity must be greater than or equal to 0")
    private Integer productQuantity;

    @NotNull(message = "product price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "product price must be greater than or equal to 0")
    private BigDecimal price;

    @NotBlank(message = "product status is required")
    @Size(max = 50, message = "product status must not exceed 50 characters")
    private String productStatus;

    @NotBlank(message = "unit of selling is required")
    @Size(max = 50, message = "unit of selling must not exceed 50 characters")
    private String unitOfSelling;

    private String productUrl;
}
