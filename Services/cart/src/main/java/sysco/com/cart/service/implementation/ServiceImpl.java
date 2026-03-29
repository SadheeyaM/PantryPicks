package sysco.com.cart.service.implementation;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import sysco.com.cart.dto.request.CartItemPatchRequestDto;
import sysco.com.cart.dto.request.CartItemRequestDto;
import sysco.com.cart.dto.request.CartRequestDto;
import sysco.com.cart.dto.response.CartCreateResponseDto;
import sysco.com.cart.dto.response.CartResponseDto;
import sysco.com.cart.entity.Cart;
import sysco.com.cart.exception.CartCreationException;
import sysco.com.cart.repository.CartRepository;
import sysco.com.cart.service.CartService;

import java.util.List;

import static sysco.com.cart.mapper.CartMapper.mapToCart;
import static sysco.com.cart.mapper.CartMapper.mapToCreateResponse;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements CartService {

    private final CartRepository cartRepository ;


    @Override
    public CartCreateResponseDto createCart(CartRequestDto cartRequestDto) {
        try {
            Cart cart = mapToCart(cartRequestDto) ;
            Cart savedCart = cartRepository.save(cart) ;
            log.info("Cart created successfully: {}", savedCart);

            return mapToCreateResponse(savedCart,savedCart.getCartId() + " created successfully.");
        }
        catch (Exception exception) {
            log.error("Error occurred while creating cart: {}", exception.getMessage(), exception);
            throw new CartCreationException("Failed to create cart. Please try again later.");
        }
    }

    @Override
    public CartResponseDto addItemToCart(Integer cartId, CartItemRequestDto cartItemRequestDto) {
        return null;
    }

    @Override
    public CartResponseDto getCartById(Integer cartId) {
        return null;
    }

    @Override
    public List<CartResponseDto> getAllCarts() {
        return List.of();
    }

    @Override
    public CartResponseDto updateCartItem(Integer cartId, Integer cartItemId, CartItemPatchRequestDto cartItemPatchRequestDto) {
        return null;
    }

    @Override
    public CartResponseDto removeItemFromCart(Integer cartId, Integer cartItemId) {
        return null;
    }
}
