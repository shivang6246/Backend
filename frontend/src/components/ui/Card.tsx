import React from 'react';
import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`card ${className}`}>
            {title && <div className="card-title">{title}</div>}
            {children}
        </div>
    );
};
