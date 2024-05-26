"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import YourAppLayout from "./knock";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <YourAppLayout>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </YourAppLayout>
  );
}
