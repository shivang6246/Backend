import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { Button } from '../components/ui/Button';
import type { Cart as CartType } from '../types';
import './Cart.css';

interface CartProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

export const Cart: React.FC<CartProps> = ({ onToast }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) loadCart();
    }, [user]);

    const loadCart = async () => {
        try {
            const data = await cartService.getCart(user!.id);
            setCart(data);
        } catch (error) {
            console.error('Failed to load cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (itemId: number) => {
        try {
            await cartService.removeFromCart(itemId);
            onToast('success', 'Item removed from cart');
            loadCart();
        } catch (error) {
            onToast('error', 'Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            await orderService.placeOrder(user.id);
            onToast('success', 'Order placed successfully!');
            navigate('/orders');
        } catch (error: any) {
            onToast('error', error.response?.data || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page"><div className="loader" /></div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="page">
                <div className="section-header animate-fade-up">
                    <h1 className="section-title">Shopping Cart</h1>
                </div>
                <div className="empty-state glass">
                    <div className="empty-icon">🛒</div>
                    <div className="empty-title">Your cart is empty</div>
                    <div className="empty-desc">Discover our premium collection and start shopping.</div>
                    <Button onClick={() => navigate('/products')} style={{ marginTop: 20 }}>
                        Discover Products <ArrowRight size={16} style={{ marginLeft: 8 }} />
                    </Button>
                </div>
            </div>
        );
    }

    const subtotal = cart.items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);

    return (
        <div className="page">
            <div className="section-header animate-fade-up">
                <h1 className="section-title">Shopping Cart</h1>
                <ShoppingBag color="var(--gold)" />
            </div>

            <div className="cart-container animate-fade-up">
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-img">📦</div>
                            <div className="cart-item-info">
                                <div className="cart-item-name">{item.product.name}</div>
                                <div className="cart-item-price">${item.product.price} × {item.quantity}</div>
                            </div>
                            <Button variant="ghost" onClick={() => handleRemove(item.id)}>
                                <Trash2 size={18} color="var(--red)" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary glass">
                    <h3 className="font-serif" style={{ fontSize: 22, marginBottom: 24 }}>Summary</h3>
                    <div className="summary-row">
                        <span>Items Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span style={{ color: 'var(--green)' }}>Complimentary</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <Button fullWidth onClick={handleCheckout} style={{ marginTop: 32 }}>
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};
