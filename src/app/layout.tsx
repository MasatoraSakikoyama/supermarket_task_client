import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import AppContent from "@/components/AppContent";

export const metadata: Metadata = {
  title: "Supermarket Task App",
  description: "Web application for supermarket task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReactQueryProvider>
          <AuthProvider>
            <AppContent>{children}</AppContent>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
