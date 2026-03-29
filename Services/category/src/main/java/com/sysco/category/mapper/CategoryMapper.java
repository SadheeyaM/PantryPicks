package com.sysco.category.mapper;

import com.sysco.category.dto.request.CategoryRequestDto;
import com.sysco.category.dto.response.CategoryCreatedResponseDto;
import com.sysco.category.dto.response.CategoryResponseDto;
import com.sysco.category.entity.Category;

import java.util.List;
import java.util.stream.Collectors;

public class CategoryMapper {

    public static CategoryCreatedResponseDto mapToCreateResponse(Category category, String message) {
        CategoryCreatedResponseDto categoryCreatedResponseDto = new CategoryCreatedResponseDto() ;
        categoryCreatedResponseDto.setMessage(message);
        categoryCreatedResponseDto.setCategoryId(category.getCategoryId());
        categoryCreatedResponseDto.setCategoryName(category.getCategoryName());
        categoryCreatedResponseDto.setCategoryImage(category.getCategoryImage());

        return categoryCreatedResponseDto;
    }

    public static CategoryResponseDto mapToCategoryResponse(Category category) {
        CategoryResponseDto categoryResponseDto = new CategoryResponseDto() ;

        categoryResponseDto.setCategoryId(category.getCategoryId());
        categoryResponseDto.setCategoryName(category.getCategoryName());
        categoryResponseDto.setCategoryImage(category.getCategoryImage());

        return categoryResponseDto ;
    }

    public static List<CategoryResponseDto> mapToCategoryResponseList(List<Category> categories) {
        return categories.stream()
                .map(CategoryMapper::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    public static Category mapToCategory(CategoryRequestDto categoryRequestDto) {
        Category category = new Category() ;
        category.setCategoryName(categoryRequestDto.getCategoryName());
        category.setCategoryImage(categoryRequestDto.getCategoryImage());

        return category ;
    }
}
