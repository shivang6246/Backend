package com.example.multivendor.Store.Repository;

import com.example.multivendor.Store.Model.Category;
import com.example.multivendor.Store.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product , Long> {

    List<Product> findByCategory(Category category);


    List<Product> findBySeller(Long sellerId);


    List<Product> findByNameContaining(String keyword);


    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}