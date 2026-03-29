package sysco.com.cart.dto.request;

import jakarta.persistence.CascadeType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import sysco.com.cart.entity.CartItem;
import sysco.com.cart.entity.CartStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartPatchRequestDto {
    private List<CartItem> items ;
    private Float subTotal ;
    private Float shippingCost ;
    private Float discount ;
    private CartStatus status ;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
