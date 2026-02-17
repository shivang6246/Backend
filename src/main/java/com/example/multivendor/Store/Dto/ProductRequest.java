package com.example.multivendor.Store.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProductRequest {


        private String name;
        private String description;
        private Double price;
        private Integer quantity;
        private Long categoryId;
        private Long sellerId;


    }


