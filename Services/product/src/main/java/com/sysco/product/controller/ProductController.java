package com.sysco.product.controller;

import com.sysco.product.dto.request.ProductFilterRequestDto;
import com.sysco.product.dto.request.ProductPatchRequestDto;
import com.sysco.product.dto.request.ProductRequestDto;
import com.sysco.product.dto.response.ProductResponseDto;
import com.sysco.product.dto.response.ResponseObject;
import com.sysco.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping(value="/api/v1/products")
public class ProductController extends AbstractController{
    private final ProductService productsService ;

    @PostMapping
    public ResponseEntity<ResponseObject> createProduct(@Valid @RequestBody ProductRequestDto productRequestDto) {

        log.info("Received request to create product: {}", productRequestDto);
        return sendCreatedResponse(productsService.createProduct(productRequestDto));
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllProducts(
            ProductFilterRequestDto filter,
            Pageable pageable) {

        Page<ProductResponseDto> products =
                productsService.getAllProducts(filter, pageable);

        return sendSuccessResponse(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getProductById(@PathVariable Integer id) {
        log.info("Fetching Product By Id: {}", id) ;

        return sendSuccessResponse(
                productsService.getProductById(id)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProductDetails(@PathVariable Integer id, @RequestBody ProductPatchRequestDto productPatchRequestDto) {
        log.info("Updating product details of productId {}",id);
        return sendSuccessResponse(productsService.updateProductDetails(id, productPatchRequestDto)) ;

    }
}
