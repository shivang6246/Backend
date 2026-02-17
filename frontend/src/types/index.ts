export interface User {
    id: number;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
}

export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: Category;
    seller?: User;
}

export interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
}

export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order {
    id: number;
    userId: number;
    orderDate: string;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
    user?: User;
}

export type OrderStatus = 'Created' | 'Placed' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled' | 'PENDING';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface OtpRequest {
    email: string;
    otp: string;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: number;
    sellerId: number;
}

export interface CategoryRequest {
    name: string;
}
