package com.example.multivendor.Store.Service;

import com.example.multivendor.Store.Dto.ProductRequest;
import com.example.multivendor.Store.Model.Category;
import com.example.multivendor.Store.Model.Product;

import com.example.multivendor.Store.Model.User;
import com.example.multivendor.Store.Repository.CategoryRepository;
import com.example.multivendor.Store.Repository.ProductRepository;

import com.example.multivendor.Store.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) throws Exception {
        return productRepository.findById(id)
                .orElseThrow(() -> new Exception("Product not found"));
    }

    public List<Product> getProductsBySellerId(Long sellerId) throws Exception {
        userRepository.findById(sellerId)
                .orElseThrow(() -> new Exception("Seller not found"));
        return productRepository.findBySeller(sellerId);
    }

    public List<Product> getProductsByCategoryId(Long categoryId) throws Exception {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found"));
        return productRepository.findByCategory(category);
    }

    public String createProduct(ProductRequest request) throws Exception {
        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new Exception("Category not found"));

        User user = userRepository
                .findById(request.getSellerId())
                .orElseThrow(() -> new Exception("Seller not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getQuantity());
        product.setCategory(category);
        product.setSeller(user);
        product.setCreatedAt(LocalDateTime.now());
        productRepository.save(product);
        return "Product created successfully";
    }

    public String updateProduct(Long productId, ProductRequest request) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new Exception("Product not found"));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() -> new Exception("Category not found"));

        User user = userRepository
                .findById(request.getSellerId())
                .orElseThrow(() -> new Exception("Seller not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getQuantity());
        product.setCategory(category);
        product.setSeller(user);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        return "Product updated successfully";
    }

    public void deleteProductById(Long productId) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new Exception("Product not found"));
        productRepository.delete(product);
    }
}