package com.sysco.product.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductCreateResponseDto {
    private String message;
    private String productId;
    private Integer categoryId;
    private String productName;
    private String productDescription;
    private Integer productQuantity;
    private String productUrl;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
