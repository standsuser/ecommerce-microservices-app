import { useEffect } from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

const generateSessionId = () => {
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('sessionId', sessionId);
    console.log(`Generated new sessionId: ${sessionId}`);
  } else {
    console.log(`Existing sessionId: ${sessionId}`);
  }
  return sessionId;
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    try {
      getSessionId(); // Ensure sessionId is set on initial load
    } catch (error) {
      console.error('Error accessing localStorage', error);
    }
  }, []);

  return (
    <NextUIProvider>
      <NextThemesProvider>
        <Component {...pageProps} />
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
