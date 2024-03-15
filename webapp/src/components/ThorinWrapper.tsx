"use client"
import { ThemeProvider } from "styled-components";
import { ThorinGlobalStyles, lightTheme } from "@ensdomains/thorin";

export default function ThorinWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles/>
        {children}
    </ThemeProvider>
  );
}
