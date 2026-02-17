package com.example.multivendor.Store.Controller;

import com.example.multivendor.Store.Dto.ProductRequest;
import com.example.multivendor.Store.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;;

    @PostMapping("/create")
    public ResponseEntity<String> createProduct(@RequestBody ProductRequest request) throws Exception {
        String response = productService.createProduct((request));
        return ResponseEntity.ok(response);

    }

    @PutMapping("{id}/update")
    public ResponseEntity<String> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request)
            throws Exception {
        String response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);

    }

    @DeleteMapping("{id}/delete")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) throws Exception {
        productService.deleteProductById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<com.example.multivendor.Store.Model.Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.example.multivendor.Store.Model.Product> getProductById(@PathVariable Long id)
            throws Exception {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<java.util.List<com.example.multivendor.Store.Model.Product>> getProductsBySellerId(
            @PathVariable Long sellerId) throws Exception {
        return ResponseEntity.ok(productService.getProductsBySellerId(sellerId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<java.util.List<com.example.multivendor.Store.Model.Product>> getProductsByCategoryId(
            @PathVariable Long categoryId) throws Exception {
        return ResponseEntity.ok(productService.getProductsByCategoryId(categoryId));
    }
}