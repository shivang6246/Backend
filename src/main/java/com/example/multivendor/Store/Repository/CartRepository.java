package com.example.multivendor.Store.Repository;

import com.example.multivendor.Store.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart , Long> {
        Optional<Cart> findByUser_Id(Long userId);
}
