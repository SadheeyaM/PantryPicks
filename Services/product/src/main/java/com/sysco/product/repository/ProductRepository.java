package com.sysco.product.repository;

import com.sysco.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends
        JpaRepository<Product, Integer>,
        JpaSpecificationExecutor<Product> {
}