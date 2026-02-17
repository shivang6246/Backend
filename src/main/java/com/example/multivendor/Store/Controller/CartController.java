package com.example.multivendor.Store.Controller;

import com.example.multivendor.Store.Model.Cart;
import com.example.multivendor.Store.Service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public String addToCart(@RequestParam Long userId,
                            @RequestParam Long productId,
                            @RequestParam int quantity) throws Exception {
        cartService.addToCart(userId, productId, quantity);
        return "Product added to cart successfully";
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);

    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long cartItemId) throws Exception {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok("Product removed from cart successfully");
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) throws Exception {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");


    }
}
