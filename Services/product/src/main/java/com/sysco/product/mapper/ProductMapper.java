package com.sysco.product.mapper;

import com.sysco.product.dto.response.ProductResponseDto;
import com.sysco.product.dto.request.ProductRequestDto;
import com.sysco.product.dto.response.ProductCreateResponseDto;
import com.sysco.product.entity.Product;
import lombok.experimental.UtilityClass;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class ProductMapper {
    public static ProductCreateResponseDto mapToCreateResponse(Product product, String message) {
        ProductCreateResponseDto responseDto = new ProductCreateResponseDto();
        responseDto.setMessage(message);
        responseDto.setProductId(String.valueOf(product.getProductId()));
        responseDto.setCategoryId(product.getCategoryId());
        responseDto.setProductName(product.getProductName());
        responseDto.setProductDescription(product.getProductDescription());
        responseDto.setProductQuantity(product.getProductQuantity());
        responseDto.setProductUrl(product.getProductUrl());
        responseDto.setCreatedAt(product.getCreatedAt());
        responseDto.setUpdatedAt(product.getUpdateAt());
//        responseDto.setCategoryId(product.getCategory().getCategoryId());

        return responseDto;
    }

    public static ProductResponseDto mapToProductResponse(Product product) {
        ProductResponseDto productResponseDto = new ProductResponseDto() ;

        productResponseDto.setProductId(product.getProductId());
        productResponseDto.setCategoryId(product.getCategoryId());
        productResponseDto.setProductName(product.getProductName());
        productResponseDto.setProductDescription(product.getProductDescription());
        productResponseDto.setProductQuantity(product.getProductQuantity());
        productResponseDto.setProductUrl(product.getProductUrl());
        productResponseDto.setCreatedAt(product.getCreatedAt());
        productResponseDto.setUpdatedAt(product.getUpdateAt());

        return productResponseDto;
    }

    public static List<ProductResponseDto> mapToProductResponseList(List<Product> products) {
        return products.stream()
                .map(ProductMapper::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public static Product mapToProduct(ProductRequestDto productRequestDto) {
        Product product = new Product();
        product.setProductName(productRequestDto.getProductName());
        product.setCategoryId(productRequestDto.getCategoryId());
        product.setProductDescription(productRequestDto.getProductDescription());
        product.setProductQuantity(productRequestDto.getProductQuantity());
        product.setProductUrl(productRequestDto.getProductUrl());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdateAt(LocalDateTime.now());

        return product;
    }
}
