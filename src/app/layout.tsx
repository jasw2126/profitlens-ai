import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "ProfitLens AI — Executive CFO Command Center & Profit Leak Intelligence",
  description:
    "Institutional-grade profit analytics for business owners. Instantly detect silent margin bleed, simulate cash recovery, and unlock executive action blueprints.",
  keywords: "CFO command center, profit leak detection, margin recovery, executive financial intelligence, cash flow optimization",
  openGraph: {
    title: "ProfitLens AI — Executive CFO Command Center",
    description:
      "Detect silent margin bleed in 5 seconds and recover lost profits with AI financial intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-[#05070A] text-white selection:bg-amber-500/25 selection:text-amber-300"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
