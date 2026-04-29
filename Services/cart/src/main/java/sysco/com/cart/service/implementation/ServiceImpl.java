package sysco.com.cart.service.implementation;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import sysco.com.cart.dto.request.CartItemPatchRequestDto;
import sysco.com.cart.dto.request.CartItemRequestDto;
import sysco.com.cart.dto.request.CartPatchRequestDto;
import sysco.com.cart.dto.request.CartRequestDto;
import sysco.com.cart.dto.response.CartCreateResponseDto;
import sysco.com.cart.dto.response.CartResponseDto;
import sysco.com.cart.entity.Cart;
import sysco.com.cart.entity.CartItem;
import sysco.com.cart.entity.CartStatus;
import sysco.com.cart.exception.CartCreationException;
import sysco.com.cart.exception.CartNotFoundException;
import sysco.com.cart.repository.CartRepository;
import sysco.com.cart.service.CartService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static sysco.com.cart.mapper.CartMapper.mapToCart;
import static sysco.com.cart.mapper.CartMapper.mapCartResponseDto;
import static sysco.com.cart.mapper.CartMapper.mapToCreateResponse;
import static sysco.com.cart.mapper.CartMapper.mapToCartResponseList;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceImpl implements CartService {

    private final CartRepository cartRepository ;


    @Transactional
    @Override
    public CartCreateResponseDto createCart(CartRequestDto cartRequestDto) {
        try {
            Cart cart = mapToCart(cartRequestDto);
            Cart savedCart = cartRepository.save(cart); // save to DB
            log.info("Cart created successfully: {}", savedCart);

            return mapToCreateResponse(savedCart, savedCart.getCartId() + " created successfully.");
        } catch (Exception exception) {
            log.error("Error occurred while creating cart: {}", exception.getMessage(), exception);
            throw new CartCreationException("Failed to create cart. Please try again later.");
        }
    }

    @Override
    @Transactional
    public CartResponseDto addItemToCart(Integer cartId, CartItemRequestDto cartItemRequestDto) {
        Cart cart = findCartOrThrow(cartId);

        CartItem cartItem = new CartItem();
        cartItem.setCartId(cartId);
        cartItem.setProductId(cartItemRequestDto.getProductId());
        cartItem.setQuantity(cartItemRequestDto.getQuantity());
        cartItem.setCreatedAt(LocalDateTime.now());
        cartItem.setUpdatedAt(LocalDateTime.now());

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }
        cart.getItems().add(cartItem);
        cart.setUpdatedAt(LocalDateTime.now());

        Cart savedCart = cartRepository.save(cart);
        CartResponseDto response = mapCartResponseDto(savedCart);
        response.setMessage("Item added to cart successfully.");
        return response;
    }

    @Override
    public CartResponseDto getCartById(Integer cartId) {
        Cart cart = findCartOrThrow(cartId);
        CartResponseDto response = mapCartResponseDto(cart);
        response.setMessage("Cart fetched successfully.");
        return response;
    }

    @Override
    public List<CartResponseDto> getAllCarts(Integer userId, CartStatus status) {
        List<Cart> carts;

        if (userId != null && status != null) {
            carts = cartRepository.findByUserIdAndStatus(userId, status);
        } else if (userId != null) {
            carts = cartRepository.findByUserId(userId);
        } else if (status != null) {
            carts = cartRepository.findByStatus(status);
        } else {
            carts = cartRepository.findAll();
        }

        return mapToCartResponseList(carts);
    }

    @Override
    @Transactional
    public CartResponseDto updateCartItem(Integer cartId, Integer cartItemId, CartItemPatchRequestDto cartItemPatchRequestDto) {
        Cart cart = findCartOrThrow(cartId);
        List<CartItem> items = cart.getItems();

        if (items == null) {
            throw new CartNotFoundException("Cart item not found for id: " + cartItemId);
        }

        CartItem existingItem = items.stream()
                .filter(item -> Objects.equals(item.getCartItemId(), cartItemId))
                .findFirst()
                .orElseThrow(() -> new CartNotFoundException("Cart item not found for id: " + cartItemId));

        if (cartItemPatchRequestDto.getQuantity() != null) {
            existingItem.setQuantity(cartItemPatchRequestDto.getQuantity());
        }
        existingItem.setUpdatedAt(LocalDateTime.now());

        cart.setUpdatedAt(LocalDateTime.now());
        Cart savedCart = cartRepository.save(cart);

        CartResponseDto response = mapCartResponseDto(savedCart);
        response.setMessage("Cart item updated successfully.");
        return response;
    }

    @Override
    @Transactional
    public CartResponseDto updateCart(Integer cartId, CartPatchRequestDto cartPatchRequestDto) {
        Cart cart = findCartOrThrow(cartId);

        if (cartPatchRequestDto.getStatus() != null) {
            cart.setStatus(cartPatchRequestDto.getStatus());
        }

        if (cartPatchRequestDto.getSubTotal() != null) {
            cart.setSubTotal(cartPatchRequestDto.getSubTotal());
        }

        if (cartPatchRequestDto.getShippingCost() != null) {
            cart.setShippingCost(cartPatchRequestDto.getShippingCost());
        }

        if (cartPatchRequestDto.getDiscount() != null) {
            cart.setDiscount(cartPatchRequestDto.getDiscount());
        }

        cart.setUpdatedAt(LocalDateTime.now());

        Cart savedCart = cartRepository.save(cart);

        CartResponseDto response = mapCartResponseDto(savedCart);
        response.setMessage("Cart updated successfully.");
        return response;
    }

    @Override
    @Transactional
    public CartResponseDto removeItemFromCart(Integer cartId, Integer cartItemId) {

        Cart cart = findCartOrThrow(cartId);

        List<CartItem> items = cart.getItems();

        boolean removed = items.removeIf(item ->
                Objects.equals(item.getCartItemId(), cartItemId)
        );

        if (!removed) {
            throw new CartNotFoundException("Cart item not found for id: " + cartItemId);
        }

        cart.setUpdatedAt(LocalDateTime.now());

        Cart savedCart = cartRepository.save(cart);

        CartResponseDto response = mapCartResponseDto(savedCart);
        response.setMessage("Cart item removed successfully.");

        return response;
    }

    private Cart findCartOrThrow(Integer cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found for id: " + cartId));
    }
}
