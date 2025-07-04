"use client";
import React from "react";

export type TocLink = { href: string; label: string };

export const TocContext = React.createContext<TocLink[]>([]);

export function TocProvider({
  value,
  children,
}: {
  value: TocLink[];
  children: React.ReactNode;
}) {
  return <TocContext.Provider value={value}>{children}</TocContext.Provider>;
}
