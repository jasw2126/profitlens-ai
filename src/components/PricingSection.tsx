import Link from "next/link";
import {
  CheckCircle,
  Zap,
  ArrowRight,
  BarChart3,
  Lock,
  Crown,
  ShieldCheck,
  Sparkles,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "free",
    name: "Free Starter",
    tagline: "For exploratory business audits",
    price: "₹0",
    period: "forever",
    badge: null,
    icon: BarChart3,
    iconColor: "text-white/60",
    iconBg: "bg-white/5 border-white/10",
    highlight: false,
    cta: "Start Free Audit",
    ctaVariant: "outline" as const,
    ctaHref: "/dashboard",
    features: [
      { text: "3 CSV file uploads", included: true },
      { text: "KPI & Chart breakdown", included: true },
      { text: "Money Leak #1 revealed", included: true },
      { text: "Real-time margin calculation", included: true },
      { text: "Leaks #2 & #3 (Blurred)", included: false },
      { text: "Interactive What-If Profit Simulator", included: false },
      { text: "Executive PDF Export", included: false },
      { text: "AI CFO Chat & Advisory", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth Pro",
    tagline: "For scaling brands & active operators",
    price: "₹999",
    period: "/month",
    badge: "Popular for Operators",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    highlight: false,
    cta: "Start Growth Pro (₹999/mo)",
    ctaVariant: "default" as const,
    ctaHref: "/dashboard?upgrade=growth",
    features: [
      { text: "Up to 15 CSV uploads / month", included: true },
      { text: "All 3 Money Leaks unlocked", included: true },
      { text: "Interactive What-If Profit Simulator", included: true },
      { text: "Full Profit & Loss Visualisation", included: true },
      { text: "Negative Margin SKU Stop-Loss Rules", included: true },
      { text: "Priority Email & Chat Support", included: true },
      { text: "AI CFO Chat (Unlimited Tier only)", included: false },
      { text: "Executive PDF Export (Unlimited Tier only)", included: false },
    ],
  },
  {
    id: "cfo",
    name: "CFO Unlimited",
    tagline: "The institutional executive margin defense system",
    price: "₹2,999",
    period: "/year",
    badge: "BEST VALUE • SAVE 75%",
    icon: Crown,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20 border-amber-500/40",
    highlight: true,
    cta: "Unlock CFO Unlimited (₹2,999/yr)",
    ctaVariant: "gold" as const,
    ctaHref: "/dashboard?upgrade=cfo",
    features: [
      { text: "Unlimited CSV uploads", included: true },
      { text: "All Money Leaks + AI CFO Chat", included: true },
      { text: "Executive PDF Export & Board Reports", included: true },
      { text: "Saved Report History in Supabase", included: true },
      { text: "Interactive What-If Profit Simulator", included: true },
      { text: "Full Supplier Negotiation Scripts", included: true },
      { text: "24/7 Dedicated AI CFO Reasoning Model", included: true },
      { text: "5x ROI Guarantee: Find ₹15,000+ or 100% refund", included: true },
    ],
  },
];

const faqs = [
  {
    q: "How does the Free Starter 3-CSV scan work?",
    a: "Every new user gets 3 free CSV audits with full KPI metrics and their primary #1 Money Leak unmasked. Once 3 scans are used, you can seamlessly upgrade to Growth Pro (₹999/mo) or CFO Unlimited (₹2,999/yr).",
  },
  {
    q: "Why is CFO Unlimited the Best Value?",
    a: "At ₹2,999 per year, CFO Unlimited works out to roughly ₹250/month — saving you over 75% compared to monthly subscriptions while giving you unlimited CSV scans, AI CFO Chat, and board-ready PDF exports.",
  },
  {
    q: "How does the 5x ROI Guarantee work?",
    a: "If you upload your actual store CSV and ProfitLens AI does not reveal at least 5x the subscription price (₹15,000) in identifiable margin leaks or recoverable cash within 30 days, we'll refund 100% of your payment with zero friction.",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden bg-[#05070A]">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-xs text-amber-300 font-bold mb-4 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Executive SaaS Pricing Tiers
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop Silent Cash Leaks at Every Stage{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
              Of Your Business Growth.
            </span>
          </h2>
          <p className="mt-4 text-white/50 text-base max-w-2xl mx-auto">
            From free exploratory diagnostics to an institutional CFO vault. Choose the plan that aligns with your scale.
          </p>
        </div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-[#1b1509] via-[#0E1119] to-[#05070A] border-2 border-amber-500/60 shadow-2xl shadow-amber-500/15 scale-[1.03] z-10"
                    : "bg-[#0B0F17]/80 border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        plan.highlight
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${plan.iconBg}`}
                    >
                      <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-white/50">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                        {plan.price}
                      </span>
                      <span className="text-white/40 text-xs font-medium">
                        {plan.period}
                      </span>
                      {plan.id === "cfo" && (
                        <span className="text-[11px] font-bold text-emerald-400 ml-1.5">
                          (₹250/mo eff.)
                        </span>
                      )}
                    </div>
                    {plan.id === "cfo" ? (
                      <p className="text-amber-400 text-xs font-semibold mt-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Unlimited scans &amp; board-ready exports
                      </p>
                    ) : plan.id === "growth" ? (
                      <p className="text-emerald-400 text-xs font-semibold mt-2">
                        Includes all 3 leaks &amp; What-If simulator
                      </p>
                    ) : (
                      <p className="text-white/40 text-xs mt-2">
                        Get started with 3 free audits
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white/5 text-white/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span
                          className={
                            feat.included ? "text-white/80" : "text-white/30 line-through"
                          }
                        >
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call To Action */}
                <div>
                  <Link href={plan.ctaHref} className="block">
                    <Button
                      size="lg"
                      className={`w-full h-12 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                        plan.highlight
                          ? "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black shadow-xl shadow-amber-500/25 hover:scale-[1.01]"
                          : plan.id === "growth"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black shadow-lg shadow-emerald-500/20"
                          : "border-white/15 bg-white/5 hover:bg-white/10 text-white"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>

                  {plan.highlight && (
                    <p className="text-center text-[10px] text-white/40 mt-3 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      5x ROI Guarantee • Cancel Anytime
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white text-center mb-8">
            Frequently Answered Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">Q:</span> {faq.q}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
