"use client"

import React, { createContext, useState } from "react";

import { AsciiConfig, DEFAULT_ASCII_CONFIG } from "@/lib/ascii";

type DisplayType = "webcam" | "upload";

type AsciiContextType = {
  display: DisplayType;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayType>>;
  config: AsciiConfig;
  updateConfig: (newConfig: Partial<AsciiConfig>) => void;
  isConfigOpen: boolean;
  setIsConfigOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AsciiContext = createContext<AsciiContextType | null>(null);

export function AsciiProvider({ children }: { children: React.ReactNode }) {
  const [display, setDisplay] = useState<DisplayType>("webcam");
  const [config, setConfig] = useState(DEFAULT_ASCII_CONFIG);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  function updateConfig(newConfig: Partial<AsciiConfig>) {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }

  const value = {
    display,
    setDisplay,
    config,
    updateConfig,
    isConfigOpen,
    setIsConfigOpen,
  };

  return <AsciiContext.Provider value={value}>{children}</AsciiContext.Provider>;
}

export function useAsciiProvider() {
  const context = React.useContext(AsciiContext);
  if (!context) throw new Error("useAsciiFrame must be used within an AsciiFrameProvider");
  return context;
}
