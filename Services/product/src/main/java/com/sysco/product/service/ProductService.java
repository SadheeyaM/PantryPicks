package com.sysco.product.service;

import com.sysco.product.dto.request.ProductFilterRequestDto;
import com.sysco.product.dto.request.ProductPatchRequestDto;
import com.sysco.product.dto.request.ProductRequestDto;
import com.sysco.product.dto.response.ProductCreateResponseDto;
import com.sysco.product.dto.response.ProductResponseDto;
import com.sysco.product.dto.response.ResponseObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

//@Service
public interface ProductService {
    ProductCreateResponseDto createProduct(ProductRequestDto productRequestDto) ;

    Page<ProductResponseDto> getAllProducts(ProductFilterRequestDto filter,
                                            Pageable pageable);

    ResponseObject getProductById(Integer id);

    ResponseObject updateProductDetails(Integer id, ProductPatchRequestDto productPatchRequestDto);
}
