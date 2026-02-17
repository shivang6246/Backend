package com.example.multivendor.Store.Repository;

import com.example.multivendor.Store.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order , Long> {
    List<Order> findByUserId(Long userId);


    List<Order> findByStatus(String status);
}