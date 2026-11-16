"use client";

import Link from "next/link";
import { BarChart3, Menu, X, User, LogOut, Crown, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Executive Intel", href: "/#features" },
  { label: "CFO Pricing", href: "/#pricing" },
  { label: "Command Center", href: "/dashboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, openAuthModal } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#05070A]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center group-hover:border-amber-400/70 transition-all shadow-sm shadow-amber-500/10">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Profit<span className="text-emerald-400">Lens</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase">
                <Crown className="w-2.5 h-2.5" />
                Pro Vault
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/80">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[150px] truncate font-medium">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs text-white/60 hover:text-white hover:bg-white/5 gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </Button>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-xs shadow-md shadow-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Launch CFO Center
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal("signin")}
                  className="border-white/10 text-white/80 hover:text-white hover:bg-white/5 cursor-pointer text-xs"
                >
                  Sign In
                </Button>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-xs shadow-md shadow-amber-500/20">
                    <Crown className="w-3.5 h-3.5 mr-1" />
                    Open Command Center
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#05070A]/98 backdrop-blur-2xl px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/70 hover:text-white py-2 text-sm font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-white/[0.05] text-xs text-white/70 truncate">
                  Signed in as <span className="font-semibold text-white">{user.email}</span>
                </div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold">
                    Launch Command Center
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal("signin");
                  }}
                >
                  Sign In
                </Button>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs">
                    Try CFO Command Center
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
