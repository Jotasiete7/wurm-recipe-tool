import React from 'react';

interface LanguageSwitchProps {
    lang: string;
    onLanguageChange: (lang: any) => void;
    languages?: Array<{ code: string; label: string }>;
    styles: any;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ 
    lang, 
    onLanguageChange, 
    languages = [
        { code: 'pt', label: 'PT' },
        { code: 'en', label: 'EN' },
    ],
    styles 
}) => {
    return (
        <div className={styles.selectorContainer}>
            {languages.map((l, index) => (
                <React.Fragment key={l.code}>
                    <button
                        onClick={() => onLanguageChange(l.code)}
                        className={`${styles.langBtn} ${lang === l.code ? styles.langBtnActive : ''}`}
                        title={l.code === 'pt' ? 'Português' : 'English'}
                    >
                        {l.label}
                    </button>
                    {index < languages.length - 1 && <div className={styles.divider_lang} />}
                </React.Fragment>
            ))}
        </div>
    );
};
