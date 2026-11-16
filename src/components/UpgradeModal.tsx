"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Crown,
  Lock,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export type UpgradePlanType = "growth" | "cfo";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: UpgradePlanType;
  reason?: string | null;
}

// Helper to dynamically load the Razorpay checkout.js script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("[Razorpay] Failed to load checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function UpgradeModal({
  isOpen,
  onClose,
  defaultPlan = "cfo",
  reason = null,
}: UpgradeModalProps) {
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<UpgradePlanType>(defaultPlan);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setupAlert, setSetupAlert] = useState<string | null>(null);
  const [paymentSuccessId, setPaymentSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultPlan) {
      setSelectedPlan(defaultPlan);
    }
  }, [defaultPlan, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setErrorMessage(null);
      setPaymentSuccessId(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isGrowth = selectedPlan === "growth";
  const planAmountPaise = isGrowth ? 99900 : 299900;
  const planPriceFormatted = isGrowth ? "₹999/mo" : "₹2,999/yr";
  const planName = isGrowth ? "Growth Pro" : "CFO Unlimited";

  const handleRazorpayPayment = async () => {
    setErrorMessage(null);
    setSetupAlert(null);

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    // Check if the Razorpay Key ID is missing or is still a placeholder
    const isPlaceholder =
      !razorpayKey ||
      razorpayKey.trim() === "" ||
      razorpayKey.includes("your_key") ||
      razorpayKey.includes("rzp_test_your_key_id_here");

    if (isPlaceholder) {
      const helpfulMsg =
        "Razorpay Setup Required: NEXT_PUBLIC_RAZORPAY_KEY_ID is currently a placeholder in your .env.local.\n\n" +
        "To enable the real checkout popup:\n" +
        "1. Go to your Razorpay Dashboard (Settings > API Keys)\n" +
        "2. Copy your Key ID (e.g. rzp_test_...)\n" +
        "3. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local";

      setSetupAlert(helpfulMsg);
      alert(helpfulMsg);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Could not load Razorpay SDK checkout.js. Please check your internet connection."
        );
      }

      // 2. Request order from server endpoint with dynamic amount & planId
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          amount: planAmountPaise,
          currency: "INR",
          notes: {
            user_id: user?.id || "guest",
            user_email: user?.email || "anonymous@profitlens.ai",
            plan_name: planName,
          },
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        if (orderData.isPlaceholder) {
          setSetupAlert(orderData.message || orderData.error);
          alert(orderData.message || orderData.error);
          return;
        }
        throw new Error(orderData.error || "Failed to create Razorpay order.");
      }

      // 3. Configure and trigger Razorpay popup
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ProfitLens AI",
        description: `${planName} Subscription — ${planPriceFormatted}`,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        order_id: orderData.orderId,
        prefill: {
          name: user?.user_metadata?.full_name || "Valued Business Owner",
          email: user?.email || "",
          contact: "",
        },
        theme: {
          color: isGrowth ? "#10b981" : "#f59e0b",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
        handler: (response: any) => {
          setIsLoading(false);
          setPaymentSuccessId(response.razorpay_payment_id);
          // Save upgraded plan to localStorage
          try {
            localStorage.setItem("profitlens_user_plan", selectedPlan);
            localStorage.setItem("profitlens_free_uploads_count", "0");
          } catch {}
          alert(
            `Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nOrder ID: ${response.razorpay_order_id}\n\nYour ProfitLens ${planName} account is now active!`
          );
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on("payment.failed", (response: any) => {
        setIsLoading(false);
        setErrorMessage(
          response.error?.description || "Payment failed or was cancelled by user."
        );
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("[Razorpay Error]:", err);
      setErrorMessage(err?.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#141926] via-[#0A0D15] to-[#05070A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/40 z-10 animate-in zoom-in-95 duration-200">
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Executive SaaS Tiers
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            5x ROI Guarantee
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
          {reason ? "Free Scan Limit Reached" : "Upgrade Your Financial Intelligence"}
        </h2>
        <p className="text-white/60 text-xs sm:text-sm mb-5 leading-relaxed">
          {reason ||
            "Select your upgrade tier below to unlock comprehensive profit leak audits, interactive scenario modeling, and board-ready reports."}
        </p>

        {/* Free Tier Callout info pill */}
        <div className="mb-5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-white/40" />
            <span>Tier 1 — Free Starter: 3 CSV audits, 1 Money Leak revealed</span>
          </span>
          <span className="font-bold text-white/40 uppercase text-[10px]">Active</span>
        </div>

        {/* Plan Selector Grid (2 Paid Tiers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Card: Growth Pro */}
          <div
            onClick={() => setSelectedPlan("growth")}
            className={`relative rounded-2xl p-5 border cursor-pointer transition-all ${
              selectedPlan === "growth"
                ? "bg-gradient-to-b from-emerald-950/30 to-[#0A0D15] border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Tier 2 — Growth Pro
              </span>
              <span className="text-xs font-mono font-bold text-white">Monthly</span>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                ₹999
              </span>
              <span className="text-white/50 text-xs font-medium">/ month</span>
            </div>
            <ul className="space-y-1.5 text-xs text-white/70">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Up to 15 CSV uploads / mo</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>All 3 Money Leaks unlocked</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>What-If Profit Simulator</span>
              </li>
            </ul>
          </div>

          {/* Card: CFO Unlimited */}
          <div
            onClick={() => setSelectedPlan("cfo")}
            className={`relative rounded-2xl p-5 border cursor-pointer transition-all ${
              selectedPlan === "cfo"
                ? "bg-gradient-to-b from-amber-950/40 via-[#120F06] to-[#0A0D15] border-2 border-amber-500 shadow-xl shadow-amber-500/15 scale-[1.01]"
                : "bg-white/[0.02] border-white/10 hover:border-amber-500/30"
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3 right-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-500/30">
                BEST VALUE • SAVE 75%
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Tier 3 — CFO Unlimited
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">Annual</span>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                ₹2,999
              </span>
              <span className="text-white/50 text-xs font-medium">/ year</span>
              <span className="text-[10px] text-emerald-400 font-bold ml-1">
                (₹250/mo eff.)
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-white/70">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">Unlimited CSV uploads</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>All Leaks + AI CFO Chat</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Executive PDF Export &amp; History</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Setup alert if Razorpay is in placeholder mode */}
        {setupAlert && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Razorpay API Setup Required</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              <code className="text-amber-300 bg-amber-500/20 px-1 py-0.5 rounded font-mono">
                NEXT_PUBLIC_RAZORPAY_KEY_ID
              </code>{" "}
              is currently set to a placeholder in <code className="text-white font-mono">.env.local</code>.
            </p>
            <p className="text-white/60 text-[11px]">
              Add your live or test key from the Razorpay Dashboard to process checkout.
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message */}
        {paymentSuccessId && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{planName} Activated!</span>
            </div>
            <p className="text-emerald-300/80">
              Payment Reference: <span className="font-mono text-white">{paymentSuccessId}</span>
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <Button
            className={`w-full h-12 rounded-xl text-black font-extrabold text-sm sm:text-base shadow-xl gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-70 ${
              isGrowth
                ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-emerald-500/25"
                : "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/30"
            }`}
            disabled={isLoading}
            onClick={handleRazorpayPayment}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Connecting Razorpay Gateway ({planPriceFormatted})...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                {isGrowth
                  ? "Upgrade to Growth Pro (₹999/mo)"
                  : "Unlock CFO Unlimited (₹2,999/yr)"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-white/40 hover:text-white/70 py-1 transition-colors cursor-pointer"
          >
            Stay on Free Starter Tier (3 Scans)
          </button>
        </div>

        {/* Guarantee */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-white/50">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>5x ROI Guarantee • 100% Risk-Free 30-Day Money-Back • Razorpay Secured</span>
        </div>
      </div>
    </div>
  );
}
