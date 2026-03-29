package sysco.com.cart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_item", schema = "cart")
@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartItemId ;

    private Integer cartId ;

    private Integer productId ;

    private Integer quantity ;

    private LocalDateTime createdAt ;

    private LocalDateTime updatedAt ;
}
