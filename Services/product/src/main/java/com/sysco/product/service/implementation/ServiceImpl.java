package com.sysco.product.service.implementation;

import com.sysco.product.dto.request.ProductFilterRequestDto;
import com.sysco.product.dto.request.ProductPatchRequestDto;
import com.sysco.product.dto.request.ProductRequestDto;
import com.sysco.product.dto.response.ProductCreateResponseDto;
import com.sysco.product.dto.response.ResponseObject;
import com.sysco.product.entity.Product;
import com.sysco.product.dto.response.ProductResponseDto;
import com.sysco.product.exception.ProductException;
import com.sysco.product.mapper.ProductMapper;
import com.sysco.product.repository.ProductRepository;
import com.sysco.product.service.ProductService;
import com.sysco.product.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

import static com.sysco.product.mapper.ProductMapper.*;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements ProductService {
    private final ProductRepository productRepository ;

    @Override
    public ProductCreateResponseDto createProduct(ProductRequestDto productRequestDto) {
        try {
            Product product = mapToProduct(productRequestDto);
            Product savedProduct = productRepository.save(product);
            log.info("Product created successfully: {}", savedProduct);

            return mapToCreateResponse(savedProduct, savedProduct.getProductName() + " created successfully.");
        } catch (Exception exception) {
            log.error("Error occurred while creating product: {}", exception.getMessage(), exception);
            throw new ProductException(
                    "PRODUCT_CREATION_ERROR",
                    "Failed to create product. Please try again later.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    public Page<ProductResponseDto> getAllProducts(ProductFilterRequestDto filter, Pageable pageable) {

        Page<Product> productPage = productRepository.findAll(
                ProductSpecification.withFilters(filter),
                pageable
        );

        return productPage.map(ProductMapper::mapToProductResponse);
    }

    @Override
    public ResponseObject getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        "NOT_FOUND",
                        "Product with id " + id + " not found",
                        HttpStatus.NOT_FOUND));

        ResponseObject response = new ResponseObject() ;

        response.setData(product);
        response.setStatus(HttpStatus.OK);

        return response ;
    }

    @Override
    public ResponseObject updateProductDetails(Integer id, ProductPatchRequestDto productPatchRequestDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductException(
                        "NOT_FOUND",
                        "Product with id " + id + " not found",
                        HttpStatus.NOT_FOUND
                ));

        if(productPatchRequestDto.getProductName() != null) {
            product.setProductName(productPatchRequestDto.getProductName());
        }

        if(productPatchRequestDto.getProductDescription() != null) {
            product.setProductDescription(productPatchRequestDto.getProductDescription());
        }

        if(productPatchRequestDto.getCategoryId() != null) {
            product.setCategoryId(productPatchRequestDto.getCategoryId());
        }

        if(productPatchRequestDto.getSupplierId() != null) {
            product.setSupplierId(productPatchRequestDto.getSupplierId());
        }

        if(productPatchRequestDto.getProductQuantity() != null) {
            product.setProductQuantity(productPatchRequestDto.getProductQuantity());
        }

        if(productPatchRequestDto.getPrice() != null) {
            product.setPrice(productPatchRequestDto.getPrice());
        }

        if(productPatchRequestDto.getProductStatus() != null) {
            product.setProductStatus(productPatchRequestDto.getProductStatus());
        }

        if(productPatchRequestDto.getUnitOfSelling() != null) {
            product.setUnitOfSelling(productPatchRequestDto.getUnitOfSelling());
        }

        if(productPatchRequestDto.getProductUrl() != null) {
            product.setProductUrl(productPatchRequestDto.getProductUrl());
        }

        product.setUpdateAt(LocalDateTime.now());

        try {
            productRepository.save(product);
        } catch (Exception e) {
            throw new ProductException(
                    "DATABASE_ERROR",
                    "Failed to update product",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        ResponseObject responseObject = new ResponseObject() ;
        responseObject.setData(product);
        responseObject.setStatus(HttpStatus.OK);

        return responseObject ;
    }
}