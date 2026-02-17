import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

interface TopbarProps {
    title: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <h2 className="topbar-title">{title}</h2>
            <div className="search-box">
                <Search size={16} style={{ opacity: 0.4 }} />
                <input placeholder="Search anything…" />
            </div>
            <div className="topbar-btn" title="Notifications" style={{ position: 'relative' }}>
                <Bell size={18} />
                <span className="notification-dot" />
            </div>
            <div className="avatar" title={typeof user?.name === 'string' ? user.name : 'User'}>
                {typeof user?.name === 'string' && user.name.length > 0 ? user.name[0].toUpperCase() : 'U'}
            </div>
        </header>
    );
};
