package com.sysco.product.dto.request;

import lombok.Data;

@Data
public class ProductFilterRequestDto {
    private Integer categoryId ;
    private String productName;
    private String productDescription;
    private Integer productQuantity;
    private String productUrl;
}
