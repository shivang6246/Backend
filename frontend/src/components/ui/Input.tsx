import React from 'react';
import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input className={`form-input ${className}`} {...props} />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
};
