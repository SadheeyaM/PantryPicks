package sysco.com.cart.mapper;

import lombok.experimental.UtilityClass;
import sysco.com.cart.dto.request.CartRequestDto;
import sysco.com.cart.dto.response.CartCreateResponseDto;
import sysco.com.cart.dto.response.CartResponseDto;
import sysco.com.cart.entity.Cart;
import sysco.com.cart.entity.CartStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class CartMapper {
    public static CartCreateResponseDto mapToCreateResponse(Cart cart, String message) {
        CartCreateResponseDto responseDto = new CartCreateResponseDto() ;
        responseDto.setMessage(message);
        responseDto.setCartId(cart.getCartId()) ;
        responseDto.setUserId(cart.getUserId());
        responseDto.setItems(cart.getItems());
        responseDto.setSubTotal(cart.getSubTotal());
        responseDto.setShippingCost(cart.getShippingCost());
        responseDto.setDiscount(cart.getDiscount());
        responseDto.setStatus(cart.getStatus());
        responseDto.setCreatedAt(cart.getCreatedAt());
        responseDto.setUpdatedAt(cart.getUpdatedAt());

        return responseDto ;
    }

    public static CartResponseDto mapCartResponseDto (Cart cart) {
        CartResponseDto cartResponseDto = new CartResponseDto() ;

        cartResponseDto.setMessage(cartResponseDto.getMessage()) ;
        cartResponseDto.setCartId(cart.getCartId()) ;
        cartResponseDto.setUserId(cart.getUserId());
        cartResponseDto.setItems(cart.getItems());
        cartResponseDto.setSubTotal(cart.getSubTotal());
        cartResponseDto.setShippingCost(cart.getShippingCost());
        cartResponseDto.setDiscount(cart.getDiscount());
        cartResponseDto.setStatus(cart.getStatus());
        cartResponseDto.setCreatedAt(cart.getCreatedAt());
        cartResponseDto.setUpdatedAt(cart.getUpdatedAt());
        return cartResponseDto ;
    }

    public static List<CartResponseDto> mapToCartResponseList(List <Cart> carts) {
        return carts.stream()
                .map(CartMapper::mapCartResponseDto)
                .collect(Collectors.toList()) ;
    }

    public static Cart mapToCart(CartRequestDto cartRequestDto) {
        Cart cart = new Cart() ;
        cart.setUserId(cartRequestDto.getUserId());
        cart.setSubTotal(0f);
        cart.setShippingCost(0f);
        cart.setDiscount(0f);

        cart.setStatus(CartStatus.ACTIVE);
        return cart ;
    }
}
