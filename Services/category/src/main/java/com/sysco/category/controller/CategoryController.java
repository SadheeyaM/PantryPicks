package com.sysco.category.controller;

import com.sysco.category.dto.request.CategoryPatchRequestDto;
import com.sysco.category.dto.request.CategoryRequestDto;
import com.sysco.category.dto.response.ResponseObject;
import com.sysco.category.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/v1/category")
public class CategoryController extends AbstractController{
//    private final AbstractController abstractController ;
    private final CategoryService categoryService ;

    @PostMapping
    public ResponseEntity<ResponseObject> createCategory(@Valid @RequestBody CategoryRequestDto categoryRequestDto) {

        log.info("Received request to create category: {}", categoryRequestDto);
        return sendCreatedResponse(categoryService.createCategory(categoryRequestDto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCategories() {
        log.info("Fetching all categories");
        return sendSuccessResponse(categoryService.getAllCategories()) ;
    }

    @GetMapping("/{id}")
    @Operation()
    @ApiResponses()
    public ResponseEntity<ResponseObject> getProductById(@PathVariable Integer id) {
        log.info("Fetching Product By Id: {}", id) ;

        return sendSuccessResponse(
                categoryService.getCategoryById(id)
        );
    }

    @PatchMapping("/{id}")
    @Operation()
    @ApiResponses()
    public ResponseEntity<ResponseObject> updateProductDetails(@PathVariable Integer id, @RequestBody CategoryPatchRequestDto categoryPatchRequestDto) {
        log.info("Updating product details of productId {}",id);


        return sendSuccessResponse(categoryService.updateCategory(id, categoryPatchRequestDto)) ;

    }
}
