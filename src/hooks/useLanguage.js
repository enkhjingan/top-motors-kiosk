import { createElement, useState, useContext, createContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('eng');

    return createElement(
        LanguageContext.Provider,
        { value: { language, setLanguage } },
        children
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
