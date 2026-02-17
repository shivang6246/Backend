import React from 'react';
import './Badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'gold' | 'green' | 'red' | 'blue' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold', className = '', ...props }) => {
    return <span className={`badge badge-${variant} ${className}`} {...props}>{children}</span>;
};
