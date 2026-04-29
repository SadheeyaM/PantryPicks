package sysco.com.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import sysco.com.cart.entity.Cart;
import sysco.com.cart.entity.CartStatus;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer>, JpaSpecificationExecutor<Cart> {
	List<Cart> findByUserId(Integer userId);

	List<Cart> findByStatus(CartStatus status);

	List<Cart> findByUserIdAndStatus(Integer userId, CartStatus status);
}
