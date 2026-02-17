package com.example.multivendor.Store.Repository;

import com.example.multivendor.Store.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category , Long> {
        Optional<Category> findByName(String name);
}
