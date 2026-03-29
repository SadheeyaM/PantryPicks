package sysco.com.cart.dto.response;

import lombok.Data;
import org.springframework.http.HttpStatus;
import sysco.com.cart.entity.CartItem;
import sysco.com.cart.entity.CartStatus;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class CartResponseDto {
    private String message ;
    private Integer cartId ;
    private Integer userId ;
    private List<CartItem> items ;
    private Float subTotal ;
    private Float shippingCost ;
    private Float discount ;
    private CartStatus status ;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
