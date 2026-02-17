package com.example.multivendor.Store.Controller;

import com.example.multivendor.Store.Dto.CategoryRequest;
import com.example.multivendor.Store.Model.Category;
import com.example.multivendor.Store.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest request) throws Exception {
        Category category = new Category();
        category.setName(request.getName());
        Category created = categoryService.createCategory(category);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) throws Exception {
        Category category = categoryService.getAllCategories().stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new Exception("Category not found"));
        return ResponseEntity.ok(category);

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategoryById(@PathVariable Long id) throws Exception {
        categoryService.deleteCategoryByid(id);
        return ResponseEntity.ok("Category deleted successfully");

    }
}
