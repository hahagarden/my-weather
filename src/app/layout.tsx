import "./globals.css";

import { ProtectedRouteProvider } from "@/shared/contexts/ProtectedRouteContext";

import { QueryProvider, ToastProvider } from "./providers";

const themeScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    // no-op
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <ProtectedRouteProvider>
          <QueryProvider>
            <ToastProvider />
            {children}
          </QueryProvider>
        </ProtectedRouteProvider>
      </body>
    </html>
  );
}
