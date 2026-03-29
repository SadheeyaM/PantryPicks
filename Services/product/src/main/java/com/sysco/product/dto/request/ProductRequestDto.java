package com.sysco.product.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequestDto {
    @NotBlank(message = "product name is required")
    @Size(max = 255, message = "product name must not exceed 255 characters")
    private String productName;

    @NotNull(message = "Category ID is required")
    private Integer categoryId ;

    @NotBlank(message = "product description is required")
    @Size(max = 255, message = "product description must not exceed 255 characters")
    private String productDescription;

    @NotNull(message = "product quantity is required")
    @Min(value = 0, message = "product quantity must be greater than or equal to 0")
    private Integer productQuantity;

    private String productUrl;
}
