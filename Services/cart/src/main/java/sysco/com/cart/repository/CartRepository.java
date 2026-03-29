package sysco.com.cart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import sysco.com.cart.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer>, JpaSpecificationExecutor<Cart> {
}
