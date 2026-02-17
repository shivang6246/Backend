package com.example.multivendor.Store.Controller;

import com.example.multivendor.Store.Model.Order;
import com.example.multivendor.Store.Model.OrderEnum;
import com.example.multivendor.Store.Service.OrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    // 🔥 POST /place/{userId}
    @PostMapping("/place/{userId}")
    public ResponseEntity<Order> placeOrder(@PathVariable Long userId) {

        Order order = orderService.placeOrder(userId);

        return ResponseEntity.ok(order);
    }

    // 🔥 GET /user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {

        List<Order> orders = orderService.getOrdersByUser(userId);

        return ResponseEntity.ok(orders);
    }

    // 🔥 PUT /status/{orderId}
    @PutMapping("/status/{orderId}")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderEnum status) {

        Order updatedOrder = orderService.updateOrderStatus(orderId, status);

        return ResponseEntity.ok(updatedOrder);
    }

   
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {

        Order order = orderService.getOrderById(orderId);

        return ResponseEntity.ok(order);
    }
}
