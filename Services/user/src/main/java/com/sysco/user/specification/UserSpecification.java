package com.sysco.user.specification;

import com.sysco.user.dto.request.UserFilterRequestDto;
import com.sysco.user.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<User> withFilters(UserFilterRequestDto userFilterRequestDto) {
        return (root, query, cb) -> {

            var predicates = cb.conjunction();

            if (userFilterRequestDto.getUserEmail() != null) {
                predicates = cb.and(predicates,
                        cb.like(
                                cb.lower(root.get("userEmail")),
                                "%" + userFilterRequestDto.getUserEmail().toLowerCase() + "%"
                        ));
            }

            if (userFilterRequestDto.getUserFistName() != null) {
                predicates = cb.and(predicates,
                        cb.greaterThanOrEqualTo(
                                root.get("userFirstName"),
                                userFilterRequestDto.getUserFistName()
                        ));
            }

            if (userFilterRequestDto.getUserLastName() != null) {
                predicates = cb.and(predicates,
                        cb.lessThanOrEqualTo(
                                root.get("userLastName"),
                                userFilterRequestDto.getUserLastName()
                        ));
            }

            return predicates;
        };
    }
}
