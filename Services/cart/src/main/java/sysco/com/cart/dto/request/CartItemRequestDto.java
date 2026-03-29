package sysco.com.cart.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CartItemRequestDto {
    private Integer cartId ;
    private Integer productId ;
    private Integer quantity ;
}
