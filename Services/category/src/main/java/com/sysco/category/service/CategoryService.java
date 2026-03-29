package com.sysco.category.service;

import com.sysco.category.dto.request.CategoryPatchRequestDto;
import com.sysco.category.dto.request.CategoryRequestDto;
import com.sysco.category.dto.response.CategoryCreatedResponseDto;
import com.sysco.category.dto.response.CategoryResponseDto;
import com.sysco.category.dto.response.ResponseObject;

import java.util.List;

public interface CategoryService {
    CategoryCreatedResponseDto createCategory(CategoryRequestDto categoryRequestDto) ;
    List<CategoryResponseDto> getAllCategories() ;

    ResponseObject getCategoryById(Integer categoryId) ;

    ResponseObject updateCategory(Integer Id, CategoryPatchRequestDto categoryPatchRequestDto) ;

}
