import React from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, subtitle, children }) => {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ position: 'relative' }}>
                <button className="modal-close" onClick={onClose}>
                    <X size={18} />
                </button>
                {title && <h2 className="modal-title">{title}</h2>}
                {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                {children}
            </div>
        </div>
    );
};
