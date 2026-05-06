package com.sysco.product.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductPatchRequestDto {
    private Integer categoryId ;
    private String supplierId;
    private String productName;
    private String productDescription;
    private Integer productQuantity;
    private BigDecimal price;
    private String productStatus;
    private String unitOfSelling;
    private String productUrl;
}
