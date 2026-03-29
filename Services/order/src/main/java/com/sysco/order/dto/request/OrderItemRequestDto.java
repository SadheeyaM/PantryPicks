package com.sysco.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequestDto {
    @NotNull(message = "Product Id is required")
    private Integer productId ;

    @NotNull(message = "Quantity is required")
    private Integer quantity ;

    @NotNull(message = "Price is required")
    private Float price ;
}
