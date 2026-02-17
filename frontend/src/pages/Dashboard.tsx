import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { categoryService } from '../services/categoryService';
import type { Product, Order, Category } from '../types';
import './Dashboard.css';

interface DashboardProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onToast }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log('Dashboard: Loading data...');

            // Load products with error handling
            let productsData: Product[] = [];
            try {
                productsData = await productService.getAllProducts();
                console.log('Dashboard: Products loaded:', productsData.length);
                setProducts(productsData);
            } catch (err: any) {
                console.error('Dashboard: Failed to load products:', err);
                setProducts([]);
            }

            // Load categories with error handling
            let categoriesData: Category[] = [];
            try {
                categoriesData = await categoryService.getAllCategories();
                console.log('Dashboard: Categories loaded:', categoriesData.length);
                setCategories(categoriesData);
            } catch (err: any) {
                console.error('Dashboard: Failed to load categories:', err);
                setCategories([]);
            }

            // Load orders with error handling
            if (user?.id) {
                try {
                    const ordersData = await orderService.getOrdersByUser(user.id);
                    console.log('Dashboard: Orders loaded:', ordersData.length);
                    setOrders(ordersData);
                } catch (err: any) {
                    console.error('Dashboard: Failed to load orders:', err);
                    setOrders([]);
                }
            }

            console.log('Dashboard: Data loading complete');
        } catch (error: any) {
            console.error('Dashboard: Critical error:', error);
            setError('Failed to load dashboard data. Please try refreshing the page.');
            onToast('error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: '📦', label: 'Total Products', value: products.length.toString(), change: 'Active' },
        { icon: '🛒', label: 'Cart Items', value: '0', change: 'Empty' },
        { icon: '📋', label: 'My Orders', value: orders.length.toString(), change: 'Total' },
        { icon: '🏷️', label: 'Categories', value: categories.length.toString(), change: 'Available' },
    ];

    if (loading) {
        return (
            <div className="page">
                <div className="loading-wrap">
                    <div className="loader" />
                    <p className="loading-text">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="empty-state">
                    <div className="empty-icon">⚠️</div>
                    <div className="empty-title">Unable to Load Dashboard</div>
                    <div className="empty-desc">{error}</div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={loadData}
                        style={{ marginTop: 16 }}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="welcome-banner animate-fade-up">
                <div>
                    <div className="welcome-title">
                        Welcome back, <span>{typeof user?.name === 'string' ? user.name : 'User'}!</span>
                    </div>
                    <div className="welcome-sub">Here's what's happening in your store today.</div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                        <Button size="sm" onClick={() => navigate('/products')}>
                            Browse Products
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                            View Orders
                        </Button>
                    </div>
                </div>
                <div style={{ fontSize: 72, opacity: 0.3 }}>🛍️</div>
            </div>

            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div key={s.label} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-change up">↑ {s.change}</div>
                    </div>
                ))}
            </div>

            <div className="two-col" style={{ marginBottom: 24 }}>
                <Card title="Recent Orders" className="animate-slide-r">
                    {orders.length === 0 ? (
                        <p style={{ color: 'var(--ivory-dim)', fontSize: 13 }}>No orders yet</p>
                    ) : (
                        orders.slice(0, 3).map((o) => (
                            <div key={o.id} className="order-preview">
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>Order #{o.id}</div>
                                    <div style={{ fontSize: 11, color: 'var(--ivory-dim)', marginTop: 3 }}>{o.orderDate}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Badge variant={o.status === 'Delivered' ? 'green' : 'gold'}>{o.status}</Badge>
                                    <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 4 }}>${o.totalAmount}</div>
                                </div>
                            </div>
                        ))
                    )}
                    <Button variant="ghost" size="sm" fullWidth style={{ marginTop: 14 }} onClick={() => navigate('/orders')}>
                        View All Orders →
                    </Button>
                </Card>

                <Card title="Categories" className="animate-slide-l">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {categories.map((c) => (
                            <Badge
                                key={c.id}
                                variant="gold"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/products?category=${c.id}`)}
                            >
                                {c.name}
                            </Badge>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" fullWidth style={{ marginTop: 14 }} onClick={() => navigate('/categories')}>
                        Manage Categories →
                    </Button>
                </Card>
            </div>

            <div>
                <div className="section-header">
                    <h2 className="section-title">Featured Products</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
                        See all →
                    </Button>
                </div>
                <div className="products-grid">
                    {products.slice(0, 4).map((p, i) => (
                        <div key={p.id} className="product-card" style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="product-img">📦</div>
                            <div className="product-body">
                                <div className="product-name">{p.name}</div>
                                <div className="product-desc">{p.description}</div>
                                <div className="product-footer">
                                    <div className="product-price">${p.price}</div>
                                    <span className="product-stock">Stock: {p.stock}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
