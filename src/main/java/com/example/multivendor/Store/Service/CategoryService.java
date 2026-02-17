package com.example.multivendor.Store.Service;

import com.example.multivendor.Store.Model.Category;
import com.example.multivendor.Store.Repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) throws Exception {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new Exception("Category already exists");
        }
        Category category1 = new Category();
        category1.setName(category.getName());
        return categoryRepository.save(category1);
    }

    public void deleteCategoryByid(Long id) throws Exception {
        Category category1 = categoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));
        categoryRepository.delete(category1);
    }
}
