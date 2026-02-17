package com.example.multivendor.Store.Service;

import com.example.multivendor.Store.Model.*;
import com.example.multivendor.Store.Repository.*;
import com.example.multivendor.Store.Model.*;
import com.example.multivendor.Store.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
   private final UserRepository userRepository;



    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }


    @Transactional
    public Order placeOrder(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0.0;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            double subtotal = product.getPrice() * item.getQuantity();
            totalAmount += subtotal;
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderEnum.PENDING);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        for (CartItem item : cartItems) {

            Product product = item.getProduct();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderRepository.save(order);

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public Order updateOrderStatus(Long orderId, OrderEnum status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }
}
