package sysco.com.cart.service;

import sysco.com.cart.dto.request.CartItemPatchRequestDto;
import sysco.com.cart.dto.request.CartItemRequestDto;
import sysco.com.cart.dto.request.CartRequestDto;
import sysco.com.cart.dto.response.CartCreateResponseDto;
import sysco.com.cart.dto.response.CartResponseDto;

import java.util.List;

public interface CartService {

    CartCreateResponseDto createCart(CartRequestDto cartRequestDto);

    CartResponseDto addItemToCart(Integer cartId, CartItemRequestDto cartItemRequestDto);

    CartResponseDto getCartById(Integer cartId);

    List<CartResponseDto> getAllCarts();

    CartResponseDto updateCartItem(Integer cartId, Integer cartItemId, CartItemPatchRequestDto cartItemPatchRequestDto);

    CartResponseDto removeItemFromCart(Integer cartId, Integer cartItemId);

}
