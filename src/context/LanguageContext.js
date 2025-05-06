import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import translations from '../translations'; // Static translations

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['vi', 'en', 'fr'].includes(savedLanguage)) { // Validate language code
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Change language function
  const changeLanguage = (language) => {
    if (['vi', 'en', 'fr'].includes(language)) { // Validate before setting
      setCurrentLanguage(language);
      localStorage.setItem('preferredLanguage', language);
    }
  };

  // Static translation function (using translations file)
  const t = useCallback((key) => {
    const langTranslations = translations[currentLanguage];
    if (langTranslations && typeof langTranslations[key] === 'string') { // Check if key exists and is string
      return langTranslations[key];
    }
    // Fallback to Vietnamese if translation is missing in current language
    if (currentLanguage !== 'vi' && translations.vi && typeof translations.vi[key] === 'string') {
      console.warn(`Translation missing for key "${key}" in "${currentLanguage}", falling back to Vietnamese.`);
      return translations.vi[key];
    }
    // If no translation is found even in Vietnamese, return the key itself
    console.warn(`Translation missing for key "${key}" in all languages.`);
    return key;
  }, [currentLanguage]);

  // --- Context Provider Value (Simplified) ---
  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t // Only static translation function needed now
    }}>
      {children}
    </LanguageContext.Provider>
  );
};