import React from 'react';
import { Coffee } from 'lucide-react';
import styles from './Header.module.css';
import { EcosystemMenu } from '../modules/EcosystemMenu';

export interface HeaderProps {
    variant?: 'default' | 'minimal' | 'analytics';
    accentColor?: string;
    logo?: React.ReactNode;
    brandName?: string;
    brandSubName?: string;
    currentToolId?: string;
    lang?: 'en' | 'pt';
    auth?: {
        user?: {
            name?: string;
            image?: string;
        } | null;
        isAdmin?: boolean;
        loginButton?: React.ReactNode;
        logoutForm?: React.ReactNode;
    };
    navigation?: Array<{
        label: React.ReactNode;
        href: string;
        adminOnly?: boolean;
    }>;
    centralNav?: React.ReactNode;
    extraModules?: React.ReactNode;
    LinkComponent?: React.ElementType;
}

export const Header: React.FC<HeaderProps> = ({
    variant = 'default',
    accentColor,
    logo,
    brandName = 'A Guilda',
    brandSubName,
    currentToolId,
    lang = 'en',
    auth,
    navigation = [],
    centralNav,
    extraModules,
    LinkComponent = 'a'
}) => {
    // Apply dynamic accent color if provided
    const headerStyle = accentColor ? ({ '--ag-accent': accentColor } as React.CSSProperties) : {};

    const BrandLink = LinkComponent;
    const NavLink = LinkComponent;

    return (
        <header className={`${styles.header} ag-reset`} style={headerStyle}>
            <style dangerouslySetInnerHTML={{ __html: `
                .ag-kofi-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background-color: #fcbf47 !important;
                    color: #323842 !important;
                    font-weight: 700 !important;
                    border-radius: 4px;
                    font-size: 11px;
                    text-transform: uppercase;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    text-decoration: none !important;
                    margin-right: 8px;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                }
                .ag-kofi-button:hover {
                    background-color: #f7b22a !important;
                    color: #000000 !important;
                    transform: scale(1.02);
                }
            `}} />
            <div className={styles.brandContainer}>
                <EcosystemMenu currentId={currentToolId} lang={lang} styles={styles} />
                <div className={styles.divider}></div>
                <BrandLink href="/" className={styles.brand}>
                    {logo || (
                        <>
                            {brandName} {brandSubName && <span>{brandSubName}</span>}
                        </>
                    )}
                </BrandLink>
            </div>

            {variant !== 'minimal' && (
                <div className="flex-1 flex justify-center">
                    {centralNav || (
                        <nav className={styles.nav}>
                            {navigation.map((item, idx) => {
                                if (item.adminOnly && !auth?.isAdmin) return null;
                                return (
                                    <NavLink 
                                        key={idx} 
                                        href={item.href} 
                                        className={`${styles.navLink} ${item.adminOnly ? styles.navLinkAdmin : ''}`}
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    )}
                </div>
            )}

            <div className={styles.rightSection}>
                <a 
                    href="https://ko-fi.com/aguildanode" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ag-kofi-button shrink-0"
                >
                    <Coffee size={14} className="animate-pulse shrink-0" />
                    <span className="hidden sm:inline">Support Us</span>
                </a>
                {extraModules}
                
                {auth?.user ? (
                    <div className={styles.userSection}>
                        <div className="hidden sm:flex items-center gap-2">
                            <span className={styles.userName}>{auth.user.name}</span>
                            {auth.user.image && (
                                <img 
                                    src={auth.user.image} 
                                    alt={auth.user.name || "Avatar"} 
                                    className={styles.avatar} 
                                />
                            )}
                        </div>
                        {auth.logoutForm}
                    </div>
                ) : (
                    auth?.loginButton
                )}
            </div>
        </header>
    );
};
