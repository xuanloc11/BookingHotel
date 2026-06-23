"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "VND" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatMoney: (amountInVND: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const USD_EXCHANGE_RATE = 25000;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("VND");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("app_currency") as Currency;
      if (savedCurrency === "VND" || savedCurrency === "USD") {
        setCurrency(savedCurrency);
      }
    }
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === "VND" ? "USD" : "VND";
    setCurrency(newCurrency);
    localStorage.setItem("app_currency", newCurrency);
  };

  const formatMoney = (amountInVND: number) => {
    if (currency === "USD") {
      const amountInUSD = amountInVND / USD_EXCHANGE_RATE;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amountInUSD);
    } else {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amountInVND);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
