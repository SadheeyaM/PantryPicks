package com.sysco.product.specification;

import com.sysco.product.dto.request.ProductFilterRequestDto;
import com.sysco.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> withFilters(ProductFilterRequestDto filter) {

        return (root, query, cb) -> {

            var predicates = cb.conjunction();

            if (filter.getProductName() != null) {
                predicates = cb.and(predicates,
                        cb.like(
                                cb.lower(root.get("productName")),
                                "%" + filter.getProductName().toLowerCase() + "%"
                        ));
            }

            if (filter.getProductDescription() != null) {
                predicates = cb.and(predicates,
                        cb.greaterThanOrEqualTo(
                                root.get("productQuantity"),
                                filter.getProductDescription()
                        ));
            }

            if (filter.getProductQuantity() != null) {
                predicates = cb.and(predicates,
                        cb.lessThanOrEqualTo(
                                root.get("productQuantity"),
                                filter.getProductQuantity()
                        ));
            }

            return predicates;
        };
    }
}
