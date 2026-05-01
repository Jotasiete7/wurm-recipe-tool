import React from 'react';
import '../theme/theme.css';

interface LayoutBaseProps {
    children: React.ReactNode;
    className?: string;
}

export const LayoutBase: React.FC<LayoutBaseProps> = ({ children, className = '' }) => {
    return (
        <div className={`ag-reset ${className}`}>
            {children}
        </div>
    );
};
