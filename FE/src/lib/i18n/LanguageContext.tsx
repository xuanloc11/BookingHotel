"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { dictionaries, Language, DictionaryKey } from "./dictionaries";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: DictionaryKey | string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  toggleLanguage: () => {},
  t: (key: any) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("vi");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("app_language") as Language;
    if (storedLang && (storedLang === "vi" || storedLang === "en")) {
      setLanguage(storedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    localStorage.setItem("app_language", newLang);
  };

  const t = (key: DictionaryKey | string): string => {
    const dict = dictionaries[language] as Record<string, string>;
    return dict[key as string] || (key as string);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
