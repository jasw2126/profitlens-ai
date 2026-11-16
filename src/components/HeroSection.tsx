import Link from "next/link";
import {
  ArrowRight,
  Upload,
  TrendingDown,
  TrendingUp,
  Zap,
  ShieldCheck,
  Crown,
  AlertTriangle,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "5s", label: "Executive Scan Time", accent: "text-amber-400" },
  { value: "₹4.8L", label: "Avg. Annual Bleed Found", accent: "text-rose-400" },
  { value: "14.2x", label: "Avg. Pro Vault ROI", accent: "text-amber-400" },
  { value: "₹42Cr+", label: "Capital Protected", accent: "text-emerald-400" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "256-Bit Bank-Grade Vault" },
  { icon: Zap, label: "Zero Client Data Retention" },
  { icon: Crown, label: "Executive CFO Decision Intelligence" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-[#05070A]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center py-12">
        {/* Pro Vault Executive Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide shadow-lg shadow-amber-500/5 backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-white/80">3-TIER SAAS PLATFORM:</span> Free Starter • Growth Pro ₹999/mo • CFO Unlimited
            <span className="hidden sm:inline-block text-amber-400 font-mono">₹2,999/yr</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6 max-w-5xl mx-auto">
          The Executive CFO Command Center for Businesses{" "}
          <span className="relative inline-block mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-red-500 font-extrabold drop-shadow-[0_0_35px_rgba(244,63,94,0.4)]">
              Bleeding Cash Unnoticed.
            </span>
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg lg:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10">
          Upload any sales or expense CSV. In 5 seconds flat, ProfitLens AI isolates hidden negative-margin products, runaway ad drain, and vendor price creep — generating an immediate cash recovery blueprint.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/dashboard">
            <Button
              size="xl"
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-base px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
            >
              <Upload className="w-5 h-5 text-black" />
              Launch Executive Scan — Drop CSV
              <ArrowRight className="w-5 h-5 text-black" />
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              variant="outline"
              size="xl"
              className="border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white/90 font-bold text-base px-8 py-6 rounded-2xl backdrop-blur-xl"
            >
              <Crown className="w-4 h-4 text-amber-400 mr-2" />
              Explore Pricing (From ₹0)
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-14">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-white/50 text-xs sm:text-sm font-medium"
            >
              <Icon className="w-4 h-4 text-amber-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Command Center Mockup Card with Obsidian Vault Aesthetic */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-white/10 bg-[#0B0F17]/80 backdrop-blur-2xl p-2 shadow-2xl shadow-black/80">
            {/* Top Vault Status Header */}
            <div className="rounded-2xl bg-[#05070A] border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-white/40 font-mono tracking-tight">
                    PROFITLENS_VAULT_v3.8 // CFO_LIVE_TELEMETRY.SECURE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AUDIT ACTIVE
                  </span>
                </div>
              </div>

              {/* Glowing Crimson Bleed Alert simulation right in the mockup */}
              <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-red-950/70 via-black to-red-950/50 border border-red-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left animate-pulse-crimson">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-400">
                      🚨 Silent Margin Bleed Detected
                    </p>
                    <p className="text-sm font-bold text-white">
                      ₹61,100/mo (₹7,33,200/yr) lost in negative-margin shipping &amp; ad leaks
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Actionable in Pro Vault
                </span>
              </div>

              {/* Mockup Dashboard Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <p className="text-[11px] uppercase font-semibold text-white/50 mb-1">
                    Gross Top-Line Revenue
                  </p>
                  <p className="text-2xl font-black text-white font-mono">₹2,84,500</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Healthy volume recorded</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <p className="text-[11px] uppercase font-semibold text-white/50 mb-1">
                    Operating Margin Drains
                  </p>
                  <p className="text-2xl font-black text-rose-400 font-mono">₹1,94,800</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-rose-400 font-medium">
                    <TrendingDown className="w-3 h-3" />
                    <span>68.5% cost-to-revenue ratio</span>
                  </div>
                </div>

                {/* Metric 3 - Recovery Potential */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/15 to-transparent border border-amber-500/40">
                  <p className="text-[11px] uppercase font-semibold text-amber-300 mb-1 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    CFO Recoverable Annual Cash
                  </p>
                  <p className="text-2xl font-black text-amber-400 font-mono">
                    +₹4,28,000/yr
                  </p>
                  <div className="mt-2 text-[11px] text-amber-300/80 font-medium">
                    11.9x ROI on ₹2,999/mo plan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-4xl mx-auto">
          {stats.map(({ value, label, accent }) => (
            <div
              key={label}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center"
            >
              <p className={`text-3xl sm:text-4xl font-black mb-1 font-mono ${accent}`}>
                {value}
              </p>
              <p className="text-xs uppercase tracking-wider text-white/50 font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
