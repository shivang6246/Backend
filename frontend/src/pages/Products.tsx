import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import type { Product, Category } from '../types';
import './Products.css';

interface ProductsProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

export const Products: React.FC<ProductsProps> = ({ onToast }) => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const selectedCategory = categoryParam ? parseInt(categoryParam) : 'all';

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: '',
        sellerId: user?.id?.toString() || '1'
    });

    useEffect(() => {
        loadData();
    }, [selectedCategory]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                selectedCategory === 'all'
                    ? productService.getAllProducts()
                    : productService.getProductsByCategory(selectedCategory),
                categoryService.getAllCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            onToast('error', 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.categoryId) {
            onToast('error', 'Fill name, price & category');
            return;
        }
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, {
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    quantity: parseInt(form.quantity) || 0,
                    categoryId: parseInt(form.categoryId),
                    sellerId: parseInt(form.sellerId),
                });
                onToast('success', 'Product updated!');
            } else {
                await productService.createProduct({
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    quantity: parseInt(form.quantity) || 0,
                    categoryId: parseInt(form.categoryId),
                    sellerId: parseInt(form.sellerId),
                });
                onToast('success', 'Product created!');
            }
            setShowModal(false);
            setEditingProduct(null);
            loadData();
        } catch (error) {
            onToast('error', `Failed to ${editingProduct ? 'update' : 'create'} product`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await productService.deleteProduct(id);
            onToast('success', 'Product deleted');
            loadData();
        } catch (error) {
            onToast('error', 'Failed to delete product');
        }
    };

    const handleAddToCart = async (product: Product) => {
        if (!user?.id) {
            onToast('error', 'Please login to add to cart');
            return;
        }
        try {
            await cartService.addToCart(user.id, product.id, 1);
            onToast('success', `${product.name} added to cart!`);
        } catch (error) {
            onToast('error', 'Failed to add to cart');
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            quantity: (product as any).stock?.toString() || '0',
            categoryId: (product as any).category?.id?.toString() || '',
            sellerId: (product as any).seller?.id?.toString() || user?.id?.toString() || '1'
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setForm({
            name: '',
            description: '',
            price: '',
            quantity: '',
            categoryId: '',
            sellerId: user?.id?.toString() || '1'
        });
        setShowModal(true);
    };

    if (loading && products.length === 0) return <div className="page"><div className="loader" /></div>;

    return (
        <div className="page">
            <div className="section-header animate-fade-up">
                <h1 className="section-title">Store Products</h1>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div className="filter-group">
                        <Filter size={16} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSearchParams(e.target.value === 'all' ? {} : { category: e.target.value })}
                            className="category-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    {(user?.role === 'SELLER' || user?.role === 'ADMIN') && (
                        <Button onClick={openCreateModal}>+ Add Product</Button>
                    )}
                </div>
            </div>

            <div className="products-grid">
                {products.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                        <p>No products found in this category.</p>
                    </div>
                ) : (
                    products.map((p) => (
                        <div key={p.id} className="product-card animate-fade-up">
                            <div className="product-img">📦</div>
                            <div className="product-body">
                                <div className="product-header">
                                    <div className="product-name">{p.name}</div>
                                    <Badge variant="gold">
                                        {(p as any).category?.name || 'Category'}
                                    </Badge>
                                </div>
                                <div className="product-desc">{p.description}</div>
                                <div className="product-footer">
                                    <div className="product-price">${p.price}</div>
                                    <span className="product-stock">Stock: {(p as any).stock || 0}</span>
                                </div>
                                <div className="product-actions" style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        fullWidth
                                        onClick={() => handleAddToCart(p)}
                                    >
                                        <ShoppingCart size={14} style={{ marginRight: 6 }} /> Add to Cart
                                    </Button>
                                    {(user?.role === 'ADMIN' || (user?.role === 'SELLER' && (p as any).seller?.id === user.id)) && (
                                        <>
                                            <Button variant="ghost" size="sm" onClick={() => openEditModal(p)}>
                                                <Edit size={14} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                                                <Trash2 size={14} color="var(--red)" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal open={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                <div className="input-field">
                    <label className="input-label">Category</label>
                    <select
                        className="input-base"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <Button variant="ghost" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button fullWidth onClick={handleSave}>
                        {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
