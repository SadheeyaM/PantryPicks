package com.sysco.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderItemResponseDto {
    private Integer orderItemId ;
    private Integer productId ;
    private Integer quantity ;
    private Float price ;
}
