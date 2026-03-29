package com.sysco.category.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.URL;

@Data
public class CategoryRequestDto {
    @NotBlank(message = "Category Name is required.")
    @Size(max = 255, message = "Category Name cannot be more that 255 characters.")
    private String categoryName ;

    @NotBlank(message = "Category Image is required.")
    @URL(message = "Category Image must be a valid URL")
    private String categoryImage ;
}
