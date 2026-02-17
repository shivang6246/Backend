import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md';
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        size === 'sm' ? 'btn-sm' : '',
        fullWidth ? 'btn-full' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            {loading && <div className="loader" style={{ width: 16, height: 16, borderWidth: 2 }} />}
            {children}
        </button>
    );
};
