import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { Toast as ToastType } from '../../hooks/useToast';
import './Toast.css';

interface ToastProps {
    toast: ToastType;
    onClose: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
        warn: <AlertTriangle size={20} />,
    };

    return (
        <div className={`toast ${toast.type}`}>
            <span className="toast-icon">{icons[toast.type]}</span>
            <span className="toast-msg">
                {typeof toast.message === 'string' ? toast.message : JSON.stringify(toast.message)}
            </span>
            <span className="toast-close" onClick={() => onClose(toast.id)}>
                <X size={16} />
            </span>
        </div>
    );
};

export const ToastContainer: React.FC<{ toasts: ToastType[]; onClose: (id: number) => void }> = ({ toasts, onClose }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
};
