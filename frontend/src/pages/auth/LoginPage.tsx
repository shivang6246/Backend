import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './AuthPage.css';

interface LoginPageProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onToast }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            onToast('error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await authService.login(form);
            // Mock user data since backend returns string
            const user = {
                id: 1,
                name: form.email.split('@')[0],
                email: form.email,
                role: 'CUSTOMER' as const,
            };
            login(user, 'mock-token');
            onToast('success', `Welcome back, ${user.name}!`);
            navigate('/dashboard');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Login failed';
            onToast('error', typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="orb-bg">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="icon">🛍️</div>
                    <h1>
                        Luxe<span style={{ color: 'var(--gold)' }}>Store</span>
                    </h1>
                    <p>Multivendor Marketplace</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <Button type="submit" fullWidth loading={loading}>
                        {loading ? 'Signing in…' : 'Sign In →'}
                    </Button>
                </form>

                <div className="divider-text" style={{ marginTop: 16 }}>
                    <span>Don't have an account?</span>
                </div>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/register')}>
                    Create Account
                </Button>

                <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ivory-dim)', marginTop: 24 }}>
                    Connected to Spring Boot API · JWT Secured
                </p>
            </div>
        </div>
    );
};
