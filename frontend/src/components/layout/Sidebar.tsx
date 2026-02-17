import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, FileText, Tag, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'products', icon: Package, label: 'Products', path: '/products' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { id: 'orders', icon: FileText, label: 'Orders', path: '/orders' },
    { id: 'categories', icon: Tag, label: 'Categories', path: '/categories' },
    { id: 'api', icon: Zap, label: 'API Docs', path: '/api' },
];

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [collapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-logo">
                <div className="logo-icon">🛍️</div>
                {!collapsed && (
                    <div>
                        <div className="logo-text">LuxeStore</div>
                        <div className="logo-sub">Marketplace</div>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            title={item.label}
                        >
                            <span className="nav-icon">
                                <Icon size={18} />
                            </span>
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                        </div>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item" style={{ color: 'var(--red)' }} onClick={handleLogout}>
                    <span className="nav-icon">
                        <LogOut size={18} />
                    </span>
                    {!collapsed && <span className="nav-label">Sign Out</span>}
                </div>
            </div>
        </aside>
    );
};
