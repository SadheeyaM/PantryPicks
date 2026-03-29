package sysco.com.cart.entity;

import jakarta.persistence.*;
import jdk.jfr.DataAmount;
import jdk.jfr.Enabled;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Table(name = "cart", schema = "cart")
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue()
    private Integer cartId ;
    private Integer userId ;

    @OneToMany(mappedBy = "cartId", cascade = CascadeType.ALL)
    private List<CartItem> items ;
    private Float subTotal ;
    private Float shippingCost ;
    private Float discount ;
    private CartStatus status ;
    private LocalDateTime createdAt ;
    private LocalDateTime updatedAt ;
}
