import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("eternal-chase-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage: Language = language === "en" ? "es" : "en";
    console.log('Switching language from', language, 'to', newLanguage);
    setLanguageState(newLanguage);
    localStorage.setItem("eternal-chase-language", newLanguage);
  };

  const setSpecificLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("eternal-chase-language", lang);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      setLanguage: setSpecificLanguage,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
