package sysco.com.cart.service;

import sysco.com.cart.dto.request.CartItemPatchRequestDto;
import sysco.com.cart.dto.request.CartItemRequestDto;
import sysco.com.cart.dto.request.CartPatchRequestDto;
import sysco.com.cart.dto.request.CartRequestDto;
import sysco.com.cart.dto.response.CartCreateResponseDto;
import sysco.com.cart.dto.response.CartResponseDto;
import sysco.com.cart.entity.CartStatus;

import java.util.List;

public interface CartService {

    CartCreateResponseDto createCart(CartRequestDto cartRequestDto);

    CartResponseDto addItemToCart(Integer cartId, CartItemRequestDto cartItemRequestDto);

    CartResponseDto getCartById(Integer cartId);

    List<CartResponseDto> getAllCarts(Integer userId, CartStatus status);

    CartResponseDto updateCartItem(Integer cartId, Integer cartItemId, CartItemPatchRequestDto cartItemPatchRequestDto);

    CartResponseDto updateCart(Integer cartId, CartPatchRequestDto cartPatchRequestDto);

    CartResponseDto removeItemFromCart(Integer cartId, Integer cartItemId);

}
