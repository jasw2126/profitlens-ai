import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Zap,
  CheckCircle,
  Shield,
  Crown,
  AlertTriangle,
  Lock,
  Sparkles,
  Sliders,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";

/* ─── Mini chart bars for the Profit Charts card ─── */
const ChartPreview = () => {
  const bars = [40, 65, 35, 80, 50, 95, 70, 60, 85, 68, 92, 78];
  return (
    <div className="flex items-end gap-1.5 h-24 mt-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${h}%`,
            background:
              i === 5 || i === 10
                ? "linear-gradient(180deg, #F59E0B 0%, #B45309 100%)"
                : i === 2 || i === 7
                ? "rgba(239, 68, 68, 0.7)"
                : "rgba(16, 185, 129, 0.3)",
          }}
        />
      ))}
    </div>
  );
};

/* ─── Alert rows for the Money-Leak card ─── */
const alertItems = [
  {
    icon: AlertTriangle,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30",
    title: "Negative-Margin Shipping SKU",
    amount: "-₹18,400/mo",
    desc: "Shipping cost exceeds customer fee by 53%",
    badge: "CRITICAL DRAIN",
  },
  {
    icon: TrendingDown,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    title: "Meta Ads Retargeting Decay",
    amount: "-₹26,500/mo",
    desc: "Frequency cap exceeded; ROAS dipped to 0.8x",
    badge: "HIGH BLEED",
  },
  {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    title: "Unlocked Cash Flow Potential",
    amount: "+₹1,14,000/yr",
    desc: "Automated vendor renegotiation & stop-loss rules",
    badge: "CFO RECOVERABLE",
  },
];

/* ─── Steps for the Growth Plan card ─── */
const growthSteps = [
  {
    step: "01",
    title: "Execute Shipping SKU Stop-Loss",
    desc: "Cap subsidised express shipping on orders under ₹1,500 immediately.",
    impact: "Recovers ₹18,400/mo",
    status: "UNLOCKED IN FREE TIER",
  },
  {
    step: "02",
    title: "Smart 4.5% Price Lift on Top 3 Monopolistic SKUs",
    desc: "Elasticity analysis confirms zero drop-off on high-retention products.",
    impact: "+₹48,200/mo pure profit",
    status: "PRO VAULT ONLY",
  },
  {
    step: "03",
    title: "Supplier COGS Contract Renegotiation",
    desc: "Benchmark raw packaging vs wholesale spot rates with ready scripts.",
    impact: "Saves ₹35,000/quarter",
    status: "PRO VAULT ONLY",
  },
];

export default function BentoSection() {
  return (
    <section id="features" className="relative py-28 overflow-hidden bg-[#05070A]">
      {/* Background glow effects */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-xs text-amber-300 font-bold mb-4 uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Executive CFO Cockpit
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Built Like an Institutional CFO Office,{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
              Priced at a Fraction of a Junior Accountant.
            </span>
          </h2>
          <p className="mt-4 text-white/50 text-base max-w-2xl mx-auto">
            Traditional bookkeeping tells you what happened 30 days ago. ProfitLens AI actively audits every rupee of margin bleed in real time.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Bleeding Margin Diagnostic */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#0B0F17]/90 border border-rose-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Real-Time Bleed Detection
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Automatic Profit Drain Auditing
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Instantly isolates every product line, fulfillment method, or ad channel running at an effective net loss.
              </p>

              <div className="space-y-3">
                {alertItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border ${item.bg} flex items-center justify-between`}
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-white/50">
                        {item.desc}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${item.color} block`}>
                        {item.amount}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-white/40">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/50">
              <span>Pins down micro-losses before they snowball</span>
              <span className="text-rose-400 font-bold">100% Automated</span>
            </div>
          </div>

          {/* Card 2: Interactive What-If CFO Simulator Showcase */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#141209] via-[#0B0F17] to-[#05070A] border border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Interactive Simulator
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                "What-If" CFO Recovery Engine
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Simulate trimming returns by 10% or lifting prices by 3%. Watch annual free cash flow expand exponentially.
              </p>

              {/* Mini Simulator Teaser */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/70">Trim Return Waste:</span>
                  <span className="text-amber-400 font-mono font-bold">15%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full w-[50%]" />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-white/70">Smart Price Lift:</span>
                  <span className="text-emerald-400 font-mono font-bold">6%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[30%]" />
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/50">Simulated Extra Cash:</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    +₹3,84,000/yr
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/50">
              <span className="text-amber-300 font-semibold">10x+ ROI guaranteed</span>
              <span className="font-mono text-white/70">From ₹999/mo</span>
            </div>
          </div>

          {/* Card 3: 3-Step Curated Execution Blueprint */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#0B0F17]/90 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Curated Action Blueprint
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Turn Raw Numbers into Clean Actions
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Receive prioritized, step-by-step mitigation playbooks instead of confusing, dense spreadsheets.
              </p>

              <div className="space-y-3">
                {growthSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {step.step}. {step.title}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        step.status.includes("FREE")
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      {step.desc}
                    </p>
                    <p className="text-[11px] font-mono font-bold text-emerald-400">
                      {step.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/50">
              <span>Backed by Gemini 3.8 Flash financial models</span>
              <span className="text-emerald-400 font-bold">Board-Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
