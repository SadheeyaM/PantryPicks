package com.sysco.category.dto.response;

import lombok.Data;

@Data
public class CategoryCreatedResponseDto {
    private String message ;
    private Integer categoryId ;
    private String categoryName ;
    private String categoryImage ;
}
