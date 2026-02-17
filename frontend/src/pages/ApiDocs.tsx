import React, { useState } from 'react';
import { Badge } from '../components/ui/Badge';

const API_ENDPOINTS = [
    { method: 'POST', path: '/api/auth/register', tag: 'Auth', desc: 'Register a new user' },
    { method: 'GET', path: '/api/auth/login', tag: 'Auth', desc: 'Authenticate user' },
    { method: 'POST', path: '/api/auth/send-otp', tag: 'Auth', desc: 'Send OTP to email' },
    { method: 'POST', path: '/api/auth/verify-otp', tag: 'Auth', desc: 'Verify OTP code' },
    { method: 'POST', path: '/api/products/create', tag: 'Products', desc: 'Create new product' },
    { method: 'PUT', path: '/api/products/{id}/update', tag: 'Products', desc: 'Update product' },
    { method: 'DELETE', path: '/api/products/{id}/delete', tag: 'Products', desc: 'Delete product' },
    { method: 'GET', path: '/api/products/all', tag: 'Products', desc: 'Get all products' },
    { method: 'POST', path: '/api/cart/add', tag: 'Cart', desc: 'Add item to cart' },
    { method: 'GET', path: '/api/cart/{userId}', tag: 'Cart', desc: 'Get cart by user' },
    { method: 'POST', path: '/api/orders/place/{userId}', tag: 'Orders', desc: 'Place new order' },
    { method: 'GET', path: '/api/orders/user/{userId}', tag: 'Orders', desc: 'Get user orders' },
    { method: 'POST', path: '/api/categories/create', tag: 'Categories', desc: 'Create category' },
    { method: 'GET', path: '/api/categories/all', tag: 'Categories', desc: 'Get all categories' },
];

export const ApiDocs: React.FC = () => {
    const [active, setActive] = useState('Auth');
    const tags = ['Auth', 'Products', 'Cart', 'Orders', 'Categories'];

    const methodColor: Record<string, 'green' | 'blue' | 'gold' | 'red'> = {
        GET: 'green',
        POST: 'blue',
        PUT: 'gold',
        DELETE: 'red',
    };

    return (
        <div className="page">
            <div className="section-header animate-fade-up">
                <h1 className="section-title">API Explorer</h1>
                <Badge variant="green">{API_ENDPOINTS.length} endpoints</Badge>
            </div>
            <p style={{ color: 'var(--ivory-dim)', fontSize: 13, marginBottom: 20 }}>
                Spring Boot REST API · Base URL:{' '}
                <code style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: 6, color: 'var(--gold)', fontSize: 12 }}>
                    http://localhost:8080
                </code>
            </p>

            <div className="pill-nav animate-fade-up" style={{ maxWidth: 500 }}>
                {tags.map((t) => (
                    <div key={t} className={`pill-nav-item ${active === t ? 'active' : ''}`} onClick={() => setActive(t)}>
                        {t}
                    </div>
                ))}
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: 12, fontSize: 11, textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>Method</th>
                            <th style={{ textAlign: 'left', padding: 12, fontSize: 11, textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>Endpoint</th>
                            <th style={{ textAlign: 'left', padding: 12, fontSize: 11, textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {API_ENDPOINTS.filter((e) => e.tag === active).map((e, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: 12 }}>
                                    <Badge variant={methodColor[e.method]}>{e.method}</Badge>
                                </td>
                                <td style={{ padding: 12 }}>
                                    <code style={{ fontSize: 12, color: 'var(--ivory)', background: 'var(--bg3)', padding: '3px 8px', borderRadius: 6 }}>
                                        {e.path}
                                    </code>
                                </td>
                                <td style={{ padding: 12, color: 'var(--ivory-dim)', fontSize: 13 }}>{e.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
