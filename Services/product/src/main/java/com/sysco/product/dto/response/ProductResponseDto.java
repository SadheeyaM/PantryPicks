package com.sysco.product.dto.response;

import lombok.Data ;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponseDto {
    private Integer productId;
    private Integer categoryId;
    private String supplierId;
    private String productName;
    private String productDescription;
    private Integer productQuantity;
    private BigDecimal price;
    private String productStatus;
    private String unitOfSelling;
    private String productUrl;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
