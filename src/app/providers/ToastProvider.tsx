"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

type Theme = "light" | "dark";
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const DESKTOP_TOAST_OFFSET = 80;
const DESKTOP_TOAST_RIGHT_GAP = 16;
const MOBILE_TOAST_OFFSET = 36;

const getInverseTheme = (): Theme => {
  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light") return "dark";
  if (storedTheme === "dark") return "light";

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "light" : "dark";
};

export default function ToastProvider() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    const updateTheme = () => setTheme(getInverseTheme());
    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme === "light") return setTheme("dark");
      if (storedTheme === "dark") return setTheme("light");
      setTheme(mediaQuery.matches ? "light" : "dark");
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "theme") updateTheme();
    };
    window.addEventListener("storage", handleStorage);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorage);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Toaster
      position={isMobile ? "bottom-center" : "top-right"}
      offset={{ top: DESKTOP_TOAST_OFFSET, right: DESKTOP_TOAST_RIGHT_GAP }}
      mobileOffset={MOBILE_TOAST_OFFSET}
      theme={theme}
      duration={3000}
    />
  );
}
