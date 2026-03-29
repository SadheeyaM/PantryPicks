package sysco.com.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sysco.com.cart.entity.CartItem;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
	Optional<CartItem> findByCartIdAndCartItemId(Integer cartId, Integer cartItemId);
}
