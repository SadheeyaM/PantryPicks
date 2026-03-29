package sysco.com.cart.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sysco.com.cart.dto.request.CartItemPatchRequestDto;
import sysco.com.cart.dto.request.CartItemRequestDto;
import sysco.com.cart.dto.request.CartRequestDto;
import sysco.com.cart.dto.response.CartResponseDto;
import sysco.com.cart.dto.response.ResponseObject;
import sysco.com.cart.service.CartService;

@Log4j2
@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/v1/carts")
public class CartController {
    private final AbstractController abstractController ;
    private final CartService cartService ;

    @PostMapping
    public ResponseEntity<ResponseObject> createCart(@Valid @RequestBody CartRequestDto cartRequestDto) {
        log.info("Received Request to create cart: {}", cartRequestDto);
        return abstractController.sendSuccessResponse(cartService.createCart(cartRequestDto)) ;
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllCarts() {
        log.info("Fetching all cart details");
        return abstractController.sendSuccessResponse(cartService.getAllCarts()) ;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCartById(@PathVariable("id") Integer cartId) {
        log.info("Fetching details of card: {}", cartId);
        return abstractController.sendSuccessResponse(cartService.getCartById(cartId)) ;
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<ResponseObject> addItemToCart(
            @PathVariable Integer cartId,
            @Valid @RequestBody CartItemRequestDto cartItemRequestDto
    ) {
        log.info("Received request to add item to cart {}", cartId);
        return abstractController.sendSuccessResponse(cartService.addItemToCart(cartId, cartItemRequestDto));
    }

    @PatchMapping("/{cartId}/items/{cartItemId}")
    public ResponseEntity<ResponseObject> updateCartItem(
            @PathVariable Integer cartId,
            @PathVariable Integer cartItemId,
            @Valid @RequestBody CartItemPatchRequestDto cartItemPatchRequestDto
    ) {
        log.info("Received request to update cart item {} in cart {}", cartItemId, cartId);
        return abstractController.sendSuccessResponse(
                cartService.updateCartItem(cartId, cartItemId, cartItemPatchRequestDto)
        );
    }

    @DeleteMapping("/{cartId}/items/{cartItemId}")
    public ResponseEntity<ResponseObject> removeItemFromCart(
            @PathVariable Integer cartId,
            @PathVariable Integer cartItemId
    ) {
        log.info("Received request to remove cart item {} from cart {}", cartItemId, cartId);
        return abstractController.sendSuccessResponse(cartService.removeItemFromCart(cartId, cartItemId));
    }

}
