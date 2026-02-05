import React from 'react';
import { X, Shield } from 'lucide-react';
import AdminUserManagement from './AdminUserManagement';

interface AdminPanelModalProps {
    onClose: () => void;
}

export default function AdminPanelModal({ onClose }: AdminPanelModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-wurm-panel border border-wurm-border rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-wurm-muted hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 flex items-center gap-3 border-b border-wurm-border pb-4">
                    <div className="bg-wurm-accent/10 p-2 rounded-full border border-wurm-accent/20">
                        <Shield className="text-wurm-accent" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold text-white">Admin Control Panel</h2>
                        <p className="text-wurm-muted text-xs font-mono">Manage users and system settings</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <AdminUserManagement />
                </div>
            </div>
        </div>
    );
}
