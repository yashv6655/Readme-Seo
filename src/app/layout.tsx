import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AnalyticsProvider from "@/components/providers/analytics-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "README Generator - Create SEO-Optimized READMEs for Developer Tools",
  description: "Build beautiful, SEO-optimized README files that rank well on GitHub and Google. Perfect for open source projects, libraries, and developer tools.",
  keywords: ["readme", "generator", "seo", "github", "documentation", "markdown", "developer tools"],
  authors: [{ name: "README Generator" }],
  openGraph: {
    title: "README Generator - Create SEO-Optimized READMEs",
    description: "Build beautiful, SEO-optimized README files that rank well on GitHub and Google.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AnalyticsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
