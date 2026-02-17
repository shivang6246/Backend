import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';

interface CategoriesProps {
    onToast: (type: 'success' | 'error', message: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onToast }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            onToast('error', 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            onToast('error', 'Category name required');
            return;
        }
        try {
            await categoryService.createCategory({ name: name.trim() });
            onToast('success', 'Category created!');
            setShowModal(false);
            setName('');
            loadCategories();
        } catch (error) {
            onToast('error', 'Failed to create category');
        }
    };

    if (loading) return <div className="page"><div className="loader" /></div>;

    return (
        <div className="page">
            <div className="section-header animate-fade-up">
                <h1 className="section-title">Categories</h1>
                <Button onClick={() => setShowModal(true)}>+ Create Category</Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {categories.map((c) => (
                    <Badge key={c.id} variant="gold" style={{ padding: '8px 16px', fontSize: 13 }}>
                        {c.name}
                    </Badge>
                ))}
            </div>

            <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Category">
                <Input label="Category Name" placeholder="e.g. Furniture" value={name} onChange={(e) => setName(e.target.value)} />
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <Button variant="ghost" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button fullWidth onClick={handleCreate}>Create Category</Button>
                </div>
            </Modal>
        </div>
    );
};
