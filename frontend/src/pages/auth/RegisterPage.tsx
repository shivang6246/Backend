import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import './AuthPage.css';

interface RegisterPageProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onToast }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1=form, 2=otp
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            onToast('error', 'Please fill all fields');
            return;
        }
        if (form.password.length < 6) {
            onToast('error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            // First send OTP
            await authService.sendOtp(form.email);
            onToast('success', 'OTP sent to your email!');
            setStep(2);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Failed to send OTP';
            onToast('error', typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            onToast('error', 'Enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Verify OTP
            await authService.verifyOtp({ email: form.email, otp: otpCode });

            // Register user
            await authService.register(form);
            onToast('success', 'Registration successful! Please login.');
            navigate('/');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Verification failed';
            onToast('error', typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
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
                    <p>Create Your Account</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRegister}>
                        <Input
                            label="Full Name"
                            placeholder="Your name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
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
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <Button type="submit" fullWidth loading={loading}>
                            {loading ? 'Sending OTP…' : 'Continue →'}
                        </Button>
                    </form>
                ) : (
                    <div>
                        <div className="step-indicator">
                            <div className="step done" />
                            <div className="step active" />
                        </div>
                        <p style={{ color: 'var(--ivory-dim)', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>
                            Enter the 6-digit code sent to <strong style={{ color: 'var(--gold)' }}>{form.email}</strong>
                        </p>
                        <div className="otp-group">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { otpRefs.current[i] = el; }}
                                    className={`otp-input ${digit ? 'filled' : ''}`}
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                />
                            ))}
                        </div>
                        <Button fullWidth loading={loading} onClick={handleVerifyOtp}>
                            {loading ? 'Verifying…' : 'Verify OTP ✓'}
                        </Button>
                        <Button variant="ghost" size="sm" fullWidth onClick={() => setStep(1)} style={{ marginTop: 10 }}>
                            ← Back
                        </Button>
                    </div>
                )}

                <div className="divider-text" style={{ marginTop: 16 }}>
                    <span>Already have an account?</span>
                </div>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/')}>
                    Sign In
                </Button>
            </div>
        </div>
    );
};
