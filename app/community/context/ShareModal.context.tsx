// ShareModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ShareModalContextType {
  openShareModal: boolean;
  toggleShareModal: () => void;
}

const ShareModalContext = createContext<ShareModalContextType | undefined>(
  undefined
);

export const ShareModalProvider = ({ children }: { children: ReactNode }) => {
  const [openShareModal, setOpenShareModal] = useState(false);

  const toggleShareModal = () => setOpenShareModal((prev) => !prev);

  return (
    <ShareModalContext.Provider value={{ openShareModal, toggleShareModal }}>
      {children}
    </ShareModalContext.Provider>
  );
};

// Custom hook for easy usage
export const useShareModal = () => {
  const context = useContext(ShareModalContext);
  if (!context) {
    throw new Error("useShareModal must be used within a ShareModalProvider");
  }
  return context;
};
