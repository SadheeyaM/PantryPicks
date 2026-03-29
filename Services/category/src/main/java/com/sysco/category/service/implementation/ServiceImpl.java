package com.sysco.category.service.implementation;

import com.sysco.category.dto.request.CategoryPatchRequestDto;
import com.sysco.category.dto.request.CategoryRequestDto;
import com.sysco.category.dto.response.CategoryCreatedResponseDto;
import com.sysco.category.dto.response.CategoryResponseDto;
import com.sysco.category.dto.response.ResponseObject;
import com.sysco.category.entity.Category;
import com.sysco.category.exception.CategoryException;
import com.sysco.category.repository.CategoryRepository;
import com.sysco.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.sysco.category.mapper.CategoryMapper.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository ;

    @Override
    public CategoryCreatedResponseDto createCategory(CategoryRequestDto categoryRequestDto) {
        try{
            Category category = mapToCategory(categoryRequestDto) ;
            Category savedCategory = categoryRepository.save(category) ;
            log.info("Category was created successfully. {}", savedCategory);

            return mapToCreateResponse(savedCategory, savedCategory.getCategoryName() + "created successfully") ;
        }
        catch (Exception exception) {
            log.error("Error occurred while creating product: {}", exception.getMessage(), exception);
            throw new CategoryException(
                    "Category_CREATION_ERROR",
                    "Failed to create category. Please try again later.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            ) ;
        }

    }

    @Override
    public List<CategoryResponseDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return mapToCategoryResponseList(categories) ;
    }

    @Override
    public ResponseObject getCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryException(
                        "NOT_FOUND",
                        "Category with id " + categoryId + " not found",
                        HttpStatus.NOT_FOUND
                )) ;

        ResponseObject responseObject = new ResponseObject() ;

        responseObject.setData(category);
        responseObject.setStatus(HttpStatus.OK);
        return responseObject;
    }

    @Override
    public ResponseObject updateCategory(Integer categoryId, CategoryPatchRequestDto categoryPatchRequestDto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new CategoryException(
                        "NOT_FOUND",
                        "Category with id " + categoryId + " not found",
                        HttpStatus.NOT_FOUND
                )) ;

        if(categoryPatchRequestDto.getCategoryName() != null) {
            category.setCategoryName(categoryPatchRequestDto.getCategoryName());
        }
        if(categoryPatchRequestDto.getCategoryImage() != null) {
            category.setCategoryImage(category.getCategoryImage());
        }

        categoryRepository.save(category) ;
        ResponseObject responseObject = new ResponseObject() ;

        responseObject.setData(category);
        responseObject.setStatus(HttpStatus.OK);

        return responseObject ;
    }


}
