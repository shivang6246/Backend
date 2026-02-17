import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { orderService } from '../services/orderService';
import type { Order, OrderStatus } from '../types';
import './Orders.css';

interface OrdersProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

const statuses: OrderStatus[] = ['Created', 'Placed', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'PENDING'];

export const Orders: React.FC<OrdersProps> = ({ onToast }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        if (!user?.id) return;
        try {
            const data = await orderService.getOrdersByUser(user.id);
            setOrders(data);
        } catch (error) {
            onToast('error', 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            onToast('success', `Order status updated to ${newStatus}`);
            loadOrders();
        } catch (error) {
            onToast('error', 'Failed to update order status');
        }
    };

    if (loading) return <div className="page"><div className="loader" /></div>;

    return (
        <div className="page">
            <div className="section-header animate-fade-up">
                <h1 className="section-title">Order History</h1>
                <Badge variant="gold">{orders.length} total</Badge>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state glass">
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">No orders found</div>
                    <div className="empty-desc">You haven't placed any orders yet. Once you shop, they'll appear here.</div>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((o) => (
                        <div key={o.id} className="order-card glass animate-fade-up">
                            <div className="order-header">
                                <div>
                                    <div className="order-id">Order ID: #{o.id}</div>
                                    <div className="order-date">{o.orderDate}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    {(user?.role === 'ADMIN' || user?.role === 'SELLER') ? (
                                        <select
                                            className="status-select"
                                            value={o.status}
                                            onChange={(e) => handleStatusUpdate(o.id, e.target.value as OrderStatus)}
                                        >
                                            {statuses.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Badge variant={o.status === 'Delivered' ? 'green' : 'gold'}>{o.status}</Badge>
                                    )}
                                    <div className="order-price">${o.totalAmount}</div>
                                </div>
                            </div>
                            <div className="order-footer">
                                <Button variant="ghost" size="sm">Download Invoice</Button>
                                <Button variant="ghost" size="sm">Track Order</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
