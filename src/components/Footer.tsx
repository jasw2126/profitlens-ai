import Link from "next/link";
import { BarChart3, Twitter, Linkedin, Github, Crown } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Executive Intel", href: "/#features" },
    { label: "CFO Pricing", href: "/#pricing" },
    { label: "Command Center", href: "/dashboard" },
    { label: "Changelog", href: "#" },
  ],
  Platform: [
    { label: "What-If Simulator", href: "/dashboard" },
    { label: "Silent Bleed Detection", href: "/dashboard" },
    { label: "Curiosity Paywall", href: "/dashboard" },
    { label: "Razorpay Pro Vault", href: "/#pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "5x ROI Guarantee", href: "/refund-policy#roi-guarantee" },
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05070A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">
                  Profit<span className="text-emerald-400">Lens</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase">
                  <Crown className="w-2.5 h-2.5" />
                  Pro Vault
                </span>
              </div>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs mb-6">
              Institutional-grade profit intelligence and margin bleed detection for modern business executives. Stop silent cash leaks in 5 seconds.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-white/50" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-white text-xs font-bold uppercase tracking-wider mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/45 hover:text-white/80 text-xs transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs text-center lg:text-left">
            © {new Date().getFullYear()} ProfitLens AI • Executive CFO Command Center. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/45">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund & Cancellation Policy
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Razorpay Secured 256-bit TLS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
