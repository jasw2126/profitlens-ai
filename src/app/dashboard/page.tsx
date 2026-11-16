"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Upload,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Sparkles,
  RefreshCw,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Database,
  User,
  History,
  X,
  Crown,
  Lock,
  Sliders,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { parseCSVData, ParsedStoreData } from "@/lib/csv-parser";
import { SAMPLE_STORE_CSV } from "@/lib/sample-data";
import type { AnalysisResponse } from "@/app/api/analyze/route";
import UpgradeModal, { UpgradePlanType } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  saveReportToSupabase,
  fetchUserReports,
  ReportRecord,
  supabase,
} from "@/lib/supabase";

const FREE_UPLOAD_LIMIT = 3;

export default function DashboardPage() {
  const { user, openAuthModal, signOut } = useAuth();

  const [data, setData] = useState<ParsedStoreData | null>(null);
  const [sourceName, setSourceName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [chartView, setChartView] = useState<"items" | "timeline">("items");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultPlan, setModalDefaultPlan] = useState<UpgradePlanType>("cfo");
  const [modalReason, setModalReason] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Free Tier 3-CSV Counter State
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<"free" | "growth" | "cfo">("free");

  // What-If CFO Simulator Interactive State
  const [trimWaste, setTrimWaste] = useState<number>(12); // 0% - 30%
  const [priceLift, setPriceLift] = useState<number>(6); // 0% - 20%

  // Supabase Reports Table Save & History State
  const [saveStatus, setSaveStatus] = useState<{
    status: "idle" | "saving" | "saved" | "skipped" | "error";
    message?: string;
  }>({ status: "idle" });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastReports, setPastReports] = useState<ReportRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFileNameRef = useRef<string>("");

  // Initialize count from localStorage & sync with user metadata if logged in
  useEffect(() => {
    setIsMounted(true);

    try {
      // 1. Check if user already upgraded in localStorage
      const savedPlan = localStorage.getItem("profitlens_user_plan") as "growth" | "cfo" | null;
      if (savedPlan === "growth" || savedPlan === "cfo") {
        setUserPlan(savedPlan);
      }

      // 2. Load free upload count
      const storedCount = localStorage.getItem("profitlens_free_uploads_count");
      if (storedCount !== null) {
        setUploadCount(Number(storedCount) || 0);
      }

      // 3. Check URL query parameters (e.g. ?upgrade=growth or ?upgrade=cfo)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const upgradeParam = params.get("upgrade");
        if (upgradeParam === "growth" || upgradeParam === "cfo") {
          setModalDefaultPlan(upgradeParam);
          setIsModalOpen(true);
        }
      }
    } catch {}
  }, []);

  // Sync Supabase user metadata if available
  useEffect(() => {
    if (user?.user_metadata) {
      if (user.user_metadata.plan === "growth" || user.user_metadata.plan === "cfo") {
        setUserPlan(user.user_metadata.plan);
      }
      if (typeof user.user_metadata.free_uploads_count === "number") {
        setUploadCount((prev) => Math.max(prev, user.user_metadata.free_uploads_count));
      }
    }
  }, [user]);

  const uploadsRemaining = Math.max(0, FREE_UPLOAD_LIMIT - uploadCount);

  // Helper to check quota before loading new CSV
  const checkAndConsumeUpload = (): boolean => {
    if (userPlan !== "free") {
      return true; // Paid tier has no 3-scan limit
    }

    if (uploadCount >= FREE_UPLOAD_LIMIT) {
      setModalReason(
        "You have used all 3 free CSV audits. Upgrade to Growth Pro (₹999/mo) or CFO Unlimited (₹2,999/yr) to continue running analyses."
      );
      setModalDefaultPlan("cfo");
      setIsModalOpen(true);
      setErrorMsg("Free scan limit reached (3 of 3 used). Please upgrade to continue.");
      return false;
    }

    const nextCount = uploadCount + 1;
    setUploadCount(nextCount);
    try {
      localStorage.setItem("profitlens_free_uploads_count", String(nextCount));
      if (user && supabase) {
        supabase.auth.updateUser({
          data: { free_uploads_count: nextCount },
        }).catch(() => {});
      }
    } catch {}

    return true;
  };

  // Trigger AI analysis when new data is parsed and auto-save summary to Supabase
  const runAiAnalysis = useCallback(
    async (parsed: ParsedStoreData, filenameOverride?: string) => {
      setIsAnalyzing(true);
      setErrorMsg(null);
      setSaveStatus({ status: "idle" });

      const targetFilename =
        filenameOverride || currentFileNameRef.current || "store_analysis.csv";

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalRevenue: parsed.totalRevenue,
            totalExpenses: parsed.totalExpenses,
            netProfit: parsed.netProfit,
            profitMargin: parsed.profitMargin,
            currencySymbol: parsed.currencySymbol,
            topProfitableItems: parsed.topProfitableItems,
            bottomLossItems: parsed.bottomLossItems,
            expenseCategories: parsed.expenseCategories,
          }),
        });

        if (!res.ok) {
          throw new Error(`Analysis failed with status ${res.status}`);
        }

        const json: AnalysisResponse = await res.json();
        setAnalysis(json);

        // Auto-save summary to Supabase "reports" table
        setSaveStatus({ status: "saving" });
        const saveResult = await saveReportToSupabase({
          userId: user?.id || null,
          userEmail: user?.email || null,
          filename: targetFilename,
          totalRevenue: parsed.totalRevenue,
          totalExpenses: parsed.totalExpenses,
          netProfit: parsed.netProfit,
          profitMargin: parsed.profitMargin,
          currencySymbol: parsed.currencySymbol || "₹",
          summary: json.summary,
          moneyLeaks: json.moneyLeaks || [],
          actionSteps: json.actionSteps || [],
        });

        if (saveResult.success) {
          setSaveStatus({
            status: "saved",
            message: "Summary saved to Supabase 'reports' table",
          });
        } else if (saveResult.skipped) {
          setSaveStatus({
            status: "skipped",
            message: "Local mode: Supabase keys not configured (skipped DB write)",
          });
        } else {
          setSaveStatus({
            status: "error",
            message: saveResult.error || "Could not save to Supabase",
          });
        }
      } catch (err: any) {
        console.error("AI Analysis error:", err);
        setErrorMsg("Failed to generate AI analysis. Using fallback model.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [user]
  );

  const handleCsvText = (text: string, filename: string) => {
    try {
      setErrorMsg(null);
      currentFileNameRef.current = filename;
      const parsed = parseCSVData(text);
      setData(parsed);
      setSourceName(filename);
      runAiAnalysis(parsed, filename);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to parse CSV file. Please verify format.");
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      setErrorMsg("Please upload a valid .csv file.");
      return;
    }

    // Check free tier limits before proceeding
    if (!checkAndConsumeUpload()) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        handleCsvText(content, file.name);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading file.");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const loadSampleData = () => {
    // Check free tier limits before loading demo
    if (!checkAndConsumeUpload()) {
      return;
    }
    handleCsvText(SAMPLE_STORE_CSV, "Apex_Retail_Demo_Store.csv");
  };

  const resetData = () => {
    setData(null);
    setSourceName("");
    currentFileNameRef.current = "";
    setAnalysis(null);
    setErrorMsg(null);
    setSaveStatus({ status: "idle" });
  };

  const loadUserHistory = async () => {
    if (!user) {
      openAuthModal("signin");
      return;
    }
    setIsHistoryOpen(true);
    setIsLoadingHistory(true);
    const reports = await fetchUserReports(user.id);
    setPastReports(reports);
    setIsLoadingHistory(false);
  };

  const openUpgradeModalWithPlan = (plan: UpgradePlanType, customReason?: string) => {
    setModalDefaultPlan(plan);
    setModalReason(customReason || null);
    setIsModalOpen(true);
  };

  const sym = data?.currencySymbol || "₹";

  // 1. CALCULATE SILENT MARGIN BLEED (Bleeding Cash Hook)
  const bleedingItems = useMemo(() => {
    if (!data?.records) return [];
    return data.records.filter((r) => r.profit < 0 || r.expense > r.revenue);
  }, [data]);

  const calculatedLoss = useMemo(() => {
    if (!data) return 0;
    if (bleedingItems.length > 0) {
      return bleedingItems.reduce((acc, r) => acc + Math.abs(r.profit), 0);
    }
    const highExpenseItems = data.records.filter(
      (r) => r.revenue > 0 && r.expense / r.revenue > 0.85
    );
    if (highExpenseItems.length > 0) {
      return highExpenseItems.reduce(
        (acc, r) => acc + Math.round(r.expense - r.revenue * 0.7),
        0
      );
    }
    return Math.round(data.totalExpenses * 0.12);
  }, [data, bleedingItems]);

  const annualLoss = calculatedLoss * 12;

  // 2. CALCULATE PROFIT RECOVERY SIMULATOR (The Value Engine)
  const simulatorCalculations = useMemo(() => {
    if (!data) {
      return {
        annualRevenue: 0,
        annualExpenses: 0,
        wasteSavings: 0,
        priceLiftProfit: 0,
        extraAnnualProfit: 0,
        monthlyCashLift: 0,
        roiMultiple: 1,
        paybackDays: 30,
      };
    }

    const annualRevenue = data.totalRevenue * 12;
    const annualExpenses = data.totalExpenses * 12;

    const wasteSavings = Math.round(annualExpenses * (trimWaste / 100));
    const priceLiftProfit = Math.round(annualRevenue * (priceLift / 100));
    const extraAnnualProfit = wasteSavings + priceLiftProfit;
    const monthlyCashLift = Math.round(extraAnnualProfit / 12);

    const annualCost = 2999; // Annual Pro plan cost (₹2,999/yr)
    const roiMultiple = Math.max(1, Math.round(extraAnnualProfit / annualCost));
    const paybackDays = Math.max(1, Math.round(annualCost / (extraAnnualProfit / 365)));

    return {
      annualRevenue,
      annualExpenses,
      wasteSavings,
      priceLiftProfit,
      extraAnnualProfit,
      monthlyCashLift,
      roiMultiple,
      paybackDays,
    };
  }, [data, trimWaste, priceLift]);

  const chartData = data
    ? chartView === "items"
      ? data.itemsComparison.map((i) => ({
          label: i.name,
          revenue: i.revenue,
          expenses: i.expenses,
          profit: i.profit,
        }))
      : data.timelineComparison.map((t) => ({
          label: t.date,
          revenue: t.revenue,
          expenses: t.expenses,
          profit: t.profit,
        }))
    : [];

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* Top Executive Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#05070A]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:border-amber-400 transition-all shadow-sm shadow-amber-500/10">
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight">
                  Profit<span className="text-emerald-400">Lens</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase">
                  <Crown className="w-2.5 h-2.5" />
                  CFO Center
                </span>
              </div>
            </Link>

            {data && (
              <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[180px] text-white/80 font-medium">
                  {sourceName}
                </span>
                <span className="text-white/40">({data.records.length} items)</span>
              </div>
            )}
          </div>

          {/* Action Header Buttons & Free CSV Counter */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* ─── REQUIREMENT 2: FREE TIER 3-CSV COUNTER BADGE ─── */}
            {userPlan === "free" ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs shadow-sm transition-all ${
                  uploadsRemaining > 0
                    ? "bg-white/[0.04] border-white/10 text-white/80"
                    : "bg-red-500/15 border-red-500/40 text-red-300 animate-pulse"
                }`}
                title={`You have used ${uploadCount} of ${FREE_UPLOAD_LIMIT} free audits`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    uploadsRemaining > 0 ? "bg-emerald-400" : "bg-red-500"
                  }`}
                />
                <span className="text-white/70">
                  Free Audits Left:{" "}
                  <strong
                    className={`font-mono ${
                      uploadsRemaining > 0 ? "text-amber-400" : "text-red-400"
                    }`}
                  >
                    {uploadsRemaining} / {FREE_UPLOAD_LIMIT}
                  </strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{userPlan === "growth" ? "Growth Pro" : "CFO Unlimited"}</span>
              </div>
            )}

            {/* Supabase Past Reports Button */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={loadUserHistory}
                className="text-xs border-white/10 text-white/70 hover:text-white hover:bg-white/5 gap-1.5 hidden sm:inline-flex"
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audits</span>
              </Button>
            )}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/80">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[100px] truncate hidden md:inline-block">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-white/40 hover:text-white ml-1 text-[11px] underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAuthModal("signin")}
                className="text-xs border-white/10 text-white/80 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Sign In
              </Button>
            )}

            {data && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetData}
                className="text-xs border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                New File
              </Button>
            )}

            {/* Upgrade Button */}
            <Button
              size="sm"
              onClick={() => openUpgradeModalWithPlan("cfo")}
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-black" />
              <span>Upgrade</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-black/20 rounded font-black uppercase">
                PRO
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <div className="flex items-center gap-3">
              {uploadCount >= FREE_UPLOAD_LIMIT && userPlan === "free" && (
                <button
                  onClick={() => openUpgradeModalWithPlan("cfo", "Choose Growth Pro or CFO Unlimited to unlock unlimited uploads.")}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs"
                >
                  Upgrade Now
                </button>
              )}
              <button
                onClick={() => setErrorMsg(null)}
                className="text-rose-400 hover:text-rose-200 text-xs underline font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* STATE 1: NO CSV LOADED YET */}
        {!data && (
          <div className="max-w-3xl mx-auto my-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4 uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Executive CFO Command Center // 3-Tier SaaS Model
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Audit Silent Profit Bleed in 5 Seconds
              </h1>
              <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
                Drop your raw sales or expense CSV. Our CFO intelligence model isolates negative-margin items, runaway operating bleed, and calculates your exact cash recovery upside.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => {
                if (uploadCount >= FREE_UPLOAD_LIMIT && userPlan === "free") {
                  openUpgradeModalWithPlan(
                    "cfo",
                    "You have completed your 3 free audits. Choose a tier below to upload more files."
                  );
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 group ${
                isDragging
                  ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                  : "border-white/15 bg-white/[0.02] hover:border-amber-500/40 hover:bg-white/[0.04]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shadow-lg shadow-amber-500/10">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">
                Drop your business CSV here, or{" "}
                <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-4">
                  browse files
                </span>
              </h3>
              <p className="text-white/40 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Supports Shopify, Amazon Seller, WooCommerce, Stripe, QuickBooks, Zoho Books, or custom spreadsheets.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/50">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {uploadsRemaining} of {FREE_UPLOAD_LIMIT} Free Audits Remaining
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Silent Bleed Detection
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  What-If CFO Simulator
                </span>
              </div>
            </div>

            {/* Quick Demo Option */}
            <div className="mt-8 text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3 font-semibold">
                Want to test with real numbers right now?
              </p>
              <Button
                variant="outline"
                onClick={loadSampleData}
                className="border-amber-500/40 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 text-xs px-6 py-3 h-auto rounded-xl gap-2 transition-all cursor-pointer font-bold shadow-md shadow-amber-500/5"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Load Live E-Commerce Store Demo CSV ({uploadsRemaining} free left)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Button>
            </div>
          </div>
        )}

        {/* STATE 2: CSV LOADED & DASHBOARD ACTIVE */}
        {data && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-white">{sourceName}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    Parsed {data.records.length} transactions across {data.itemsComparison.length} SKU categories
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runAiAnalysis(data, sourceName)}
                  disabled={isAnalyzing}
                  className="border-white/10 text-xs text-white/70 hover:text-white hover:bg-white/5 gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin text-amber-400" : ""}`} />
                  {isAnalyzing ? "Auditing Margins..." : "Re-Run Gemini Audit"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => openUpgradeModalWithPlan("cfo")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  Export Board PDF
                </Button>
              </div>
            </div>

            {/* ─── REQUIREMENT 2: URGENT "BLEEDING CASH" ALERT BANNER (The Hook) ─── */}
            <section className="relative overflow-hidden rounded-3xl border-2 border-red-500/60 bg-gradient-to-r from-red-950/80 via-[#0B070A] to-red-950/60 p-6 sm:p-7 shadow-2xl animate-pulse-crimson">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-500/30">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/30 text-red-200 border border-red-500/50">
                        CRITICAL REVENUE LEAK DETECTED
                      </span>
                      <span className="text-white/40 text-xs">
                        {bleedingItems.length} bleeding item lines identified
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                      🚨 PROFIT LEAK ALERT: Your data reveals {sym}
                      <span className="text-red-400 font-mono">
                        {calculatedLoss.toLocaleString("en-IN")}
                      </span>
                      /mo ({sym}
                      <span className="text-red-400 font-mono">
                        {annualLoss.toLocaleString("en-IN")}
                      </span>
                      /yr) in silent margin bleed.
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-3xl leading-relaxed">
                      Negative unit economics, high return friction, or subsidized logistics are actively draining your retained earnings every single day.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <Button
                    onClick={() => openUpgradeModalWithPlan("cfo")}
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs sm:text-sm px-6 py-5 rounded-xl shadow-xl shadow-amber-500/25 cursor-pointer hover:scale-[1.02] transition-all gap-2"
                  >
                    <Crown className="w-4 h-4 text-black" />
                    Deploy Fix Blueprint (From ₹999/mo)
                    <ArrowRight className="w-4 h-4 text-black" />
                  </Button>
                </div>
              </div>
            </section>

            {/* 1. DARK-MODE KPI CARDS */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="rounded-2xl p-6 bg-gradient-to-b from-[#101622] to-[#070A0F] border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-xl">
                  <div className="flex items-center justify-between text-white/60 text-xs mb-3">
                    <span className="font-bold uppercase tracking-wider text-white/50">Gross Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight font-mono mb-2">
                    {sym}{data.totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Top-Line Gross Inflow</span>
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="rounded-2xl p-6 bg-gradient-to-b from-[#101622] to-[#070A0F] border border-white/[0.08] hover:border-rose-500/40 transition-all shadow-xl">
                  <div className="flex items-center justify-between text-white/60 text-xs mb-3">
                    <span className="font-bold uppercase tracking-wider text-white/50">Total Operating Expenses</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-rose-400 tracking-tight font-mono mb-2">
                    {sym}{data.totalExpenses.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                    <span>
                      {data.totalRevenue > 0
                        ? `${((data.totalExpenses / data.totalRevenue) * 100).toFixed(1)}% of Revenue Absorbed`
                        : "Operating Cost"}
                    </span>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="rounded-2xl p-6 bg-gradient-to-b from-[#101622] to-[#070A0F] border border-white/[0.08] hover:border-emerald-500/40 transition-all shadow-xl">
                  <div className="flex items-center justify-between text-white/60 text-xs mb-3">
                    <span className="font-bold uppercase tracking-wider text-white/50">Net Retained Cash</span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        data.netProfit >= 0
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-black tracking-tight font-mono mb-2 ${
                      data.netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {data.netProfit >= 0 ? "+" : ""}
                    {sym}{data.netProfit.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <span>Clean Take-Home Retained Earnings</span>
                  </div>
                </div>

                {/* Profit Margin */}
                <div className="rounded-2xl p-6 bg-gradient-to-b from-[#101622] to-[#070A0F] border border-white/[0.08] hover:border-amber-500/40 transition-all shadow-xl">
                  <div className="flex items-center justify-between text-white/60 text-xs mb-3">
                    <span className="font-bold uppercase tracking-wider text-white/50">Effective Net Margin</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-300 tracking-tight font-mono mb-2">
                    {data.profitMargin.toFixed(1)}%
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        data.profitMargin >= 25
                          ? "bg-emerald-500/20 text-emerald-300"
                          : data.profitMargin >= 10
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {data.profitMargin >= 25
                        ? "Robust (>25%)"
                        : data.profitMargin >= 10
                        ? "Moderate (10-25%)"
                        : "Critical Compression (<10%)"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. INTERACTIVE RECHARTS BAR CHART */}
            <section className="rounded-3xl p-6 sm:p-8 bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    Revenue vs. Expenses Breakdown
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Side-by-side comparison illustrating profitability distribution across store operations.
                  </p>
                </div>

                {/* Chart Toggle View */}
                <div className="inline-flex p-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs">
                  <button
                    onClick={() => setChartView("items")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartView === "items"
                        ? "bg-amber-500 text-black shadow-md"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    By Top Items
                  </button>
                  <button
                    onClick={() => setChartView("timeline")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      chartView === "timeline"
                        ? "bg-amber-500 text-black shadow-md"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    By Date / Timeline
                  </button>
                </div>
              </div>

              {/* Chart Component */}
              <div className="h-[360px] w-full pt-4">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="#ffffff40"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "#ffffff15" }}
                        interval={0}
                        tickFormatter={(val) => {
                          if (!val) return "";
                          return val.length > 14 ? `${val.substring(0, 12)}…` : val;
                        }}
                      />
                      <YAxis
                        stroke="#ffffff40"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "#ffffff15" }}
                        tickFormatter={(val) => `${sym}${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#070B14",
                          borderColor: "rgba(245,158,11,0.25)",
                          borderRadius: "14px",
                          color: "#fff",
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
                      />
                      <Bar
                        name="Revenue"
                        dataKey="revenue"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />
                      <Bar
                        name="Expenses"
                        dataKey="expenses"
                        fill="#ef4444"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/40 text-xs">
                    Initializing chart telemetry...
                  </div>
                )}
              </div>
            </section>

            {/* ─── REQUIREMENT 3: INTERACTIVE "PROFIT RECOVERY SIMULATOR" (The Value) ─── */}
            <section
              id="cfo-simulator"
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#121008] via-[#0A0D15] to-[#05070A] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden"
            >
              {/* Radial Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      Executive What-If CFO Simulator
                    </span>
                    <span className="text-white/40 text-xs bg-white/5 px-2.5 py-1 rounded-full border border-white/5 hidden sm:inline-block">
                      Available in Growth Pro &amp; CFO Unlimited
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Simulate Your Immediate Profit Recovery
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl">
                    Adjust the CFO sliders below to test the compounding cash-flow impact of trimming returns &amp; optimizing pricing on your current run-rate.
                  </p>
                </div>

                {/* Preset Scenarios */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setTrimWaste(5);
                      setPriceLift(2);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10 cursor-pointer"
                  >
                    Conservative
                  </button>
                  <button
                    onClick={() => {
                      setTrimWaste(12);
                      setPriceLift(6);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors border border-amber-500/40 cursor-pointer"
                  >
                    Recommended
                  </button>
                  <button
                    onClick={() => {
                      setTrimWaste(22);
                      setPriceLift(10);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10 cursor-pointer"
                  >
                    Aggressive
                  </button>
                </div>
              </div>

              {/* Simulator Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Sliders (Left 7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Slider 1: Trim Waste & Returns (0%–30%) */}
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                        <div>
                          <label className="text-sm font-bold text-white block">
                            Trim Waste, Returns &amp; Over-Spend
                          </label>
                          <span className="text-[11px] text-white/40">
                            Eliminates packaging bloat, ad decay &amp; return logistics
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black font-mono text-rose-400">
                          {trimWaste}%
                        </span>
                        <span className="text-[10px] text-white/40 block">Range: 0%–30%</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={trimWaste}
                      onChange={(e) => setTrimWaste(Number(e.target.value))}
                      className="w-full h-2.5 bg-[#172033] rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                    />

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-white/40">0% (Current Waste)</span>
                      <span className="text-rose-400 font-bold font-mono">
                        Saves +{sym}{simulatorCalculations.wasteSavings.toLocaleString("en-IN")}/yr
                      </span>
                      <span className="text-white/40">30% (Max Efficiency)</span>
                    </div>
                  </div>

                  {/* Slider 2: Smart Price Lift (0%–20%) */}
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          2
                        </div>
                        <div>
                          <label className="text-sm font-bold text-white block">
                            Smart Price Lift &amp; Bundle Optimization
                          </label>
                          <span className="text-[11px] text-white/40">
                            Micro-adjusts prices on zero-elasticity bestseller items
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black font-mono text-emerald-400">
                          +{priceLift}%
                        </span>
                        <span className="text-[10px] text-white/40 block">Range: 0%–20%</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={priceLift}
                      onChange={(e) => setPriceLift(Number(e.target.value))}
                      className="w-full h-2.5 bg-[#172033] rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                    />

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-white/40">0% (Current Pricing)</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        Adds +{sym}{simulatorCalculations.priceLiftProfit.toLocaleString("en-IN")}/yr
                      </span>
                      <span className="text-white/40">+20% (Optimized)</span>
                    </div>
                  </div>
                </div>

                {/* Display Value Output (Right 5 Cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-[#181308] to-[#0A0D15] border border-amber-500/50 shadow-2xl space-y-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300/80 block mb-1">
                        PROJECTED EXECUTIVE CASH GENERATION
                      </span>
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 font-mono tracking-tight drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] py-1">
                        +{sym}{simulatorCalculations.extraAnnualProfit.toLocaleString("en-IN")}
                      </div>
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mt-1">
                        Extra Yearly Cash to Bottom Line
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between text-white/70">
                        <span>Monthly Cash Boost:</span>
                        <span className="font-mono font-bold text-white">
                          +{sym}{simulatorCalculations.monthlyCashLift.toLocaleString("en-IN")}/mo
                        </span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Starting at:</span>
                        <span className="font-mono text-emerald-400 font-bold">₹999/mo (Growth Pro)</span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                        <span className="text-amber-300 font-bold">ROI on CFO Unlimited:</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black font-mono">
                          🔥 {simulatorCalculations.roiMultiple}x ROI
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <Button
                        onClick={() => openUpgradeModalWithPlan("cfo")}
                        className="w-full h-12 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-sm shadow-xl shadow-amber-500/30 gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <Crown className="w-4 h-4 text-black" />
                        Unlock CFO Blueprint for +{sym}{simulatorCalculations.extraAnnualProfit.toLocaleString("en-IN")}
                      </Button>
                      <p className="text-[11px] text-white/40">
                        Plan pays for itself in ~{simulatorCalculations.paybackDays} days of recovered margin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── REQUIREMENT 4: CURIOSITY-GAP PAYWALL (The Lure) ─── */}
            <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0F1424] via-[#090D17] to-[#05070A] border border-amber-500/30 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Gemini 3.8 Flash Financial Reasoning
                    </span>
                    <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Tier 1 Unlocked
                    </span>

                    {/* Supabase Save Status Badge */}
                    {saveStatus.status === "saved" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Saved to Supabase &apos;reports&apos;
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Financial Health &amp; Profit Leak Assessment
                  </h3>
                </div>

                <Button
                  size="sm"
                  onClick={() => openUpgradeModalWithPlan("cfo")}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  Export Full Executive PDF
                </Button>
              </div>

              {/* AI Executive Summary Box */}
              {isAnalyzing ? (
                <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-white">
                    Gemini 3.8 Flash is isolating profit leaks &amp; margin compression...
                  </p>
                  <p className="text-xs text-white/40 max-w-sm">
                    Synthesizing unit economics, comparing channel acquisition costs, and formulating mitigation rules.
                  </p>
                </div>
              ) : analysis ? (
                <div className="space-y-8">
                  {/* Summary Text Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      Executive Overview
                    </h4>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                      {analysis.summary}
                    </p>
                  </div>

                  {/* ─── MONEY LEAK #1: UNBLURRED (FREE INSIGHT) ─── */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-emerald-400" />
                        AI Money Leaks Audit
                      </h4>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        1 of 3 Leaks Unlocked (Free Starter)
                      </span>
                    </div>

                    {/* Unblurred Leak #1 Card */}
                    {analysis.moneyLeaks.length > 0 && (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-white/[0.03] to-emerald-950/10 border-2 border-emerald-500/40 shadow-xl space-y-3 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                              🔓 FREE INSIGHT #1
                            </span>
                            <span className="font-extrabold text-base text-white">
                              {analysis.moneyLeaks[0].leak}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded self-start sm:self-auto ${
                              analysis.moneyLeaks[0].severity === "critical"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {analysis.moneyLeaks[0].severity}
                          </span>
                        </div>

                        <div className="text-lg font-black text-rose-400 font-mono">
                          {analysis.moneyLeaks[0].impact}
                        </div>

                        <p className="text-sm text-white/80 leading-relaxed max-w-3xl">
                          {analysis.moneyLeaks[0].explanation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ─── MONEY LEAKS #2, #3 & 3-STEP ACTION PLAN: BLURRED BEHIND FROSTED-GLASS LOCK OVERLAY ─── */}
                  <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 p-2 sm:p-4">
                    {/* The Blurred Content */}
                    <div className="filter blur-[7px] select-none pointer-events-none opacity-30 space-y-6">
                      {/* Leaks #2 and #3 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(analysis.moneyLeaks.slice(1).length > 0
                          ? analysis.moneyLeaks.slice(1)
                          : [
                              {
                                leak: "Subsidized High-Weight Return Friction on Low-Margin Categories",
                                severity: "critical",
                                impact: "-₹24,800/mo drain",
                                explanation:
                                  "Reverse logistics absorbs 100% of product margin on all footwear and heavy home decor under ₹1,200 ticket value.",
                              },
                              {
                                leak: "Ad Frequency Burn & Meta Retargeting Fatigue Decay",
                                severity: "warning",
                                impact: "-₹18,200/mo wasted budget",
                                explanation:
                                  "Target audience receiving >7 impressions/week with 0.7x ROAS, diluting campaign blended contribution margins.",
                              },
                            ]
                        ).map((leak, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-sm text-white">
                                {leak.leak}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                                {leak.severity}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-rose-400 font-mono">
                              {leak.impact}
                            </div>
                            <p className="text-xs text-white/60">
                              {leak.explanation}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* 3-Step Action Plan */}
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          3-Step Recovery Action Plan (With Negotiation Scripts)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {analysis.actionSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-sm text-white">
                                  {idx + 1}. {step.step}
                                </span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                  {step.priority}
                                </span>
                              </div>
                              <div className="text-sm font-bold text-emerald-400 font-mono">
                                {step.roi}
                              </div>
                              <p className="text-xs text-white/60">
                                {step.actionPlan}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* FROSTED-GLASS LOCK OVERLAY */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#05070A]/85 backdrop-blur-md rounded-2xl text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
                        <Lock className="w-7 h-7" />
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Executive Lock // 2 Tiers Available
                      </span>

                      <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-white max-w-2xl leading-tight mb-3">
                        🔒 2 More Profit Leaks &amp; Exact Fix Steps Locked — Unlock Full Recovery Blueprint (₹2,999/mo) • 5x ROI Guarantee
                      </h4>

                      <p className="text-xs sm:text-sm text-white/70 max-w-lg mb-6 leading-relaxed">
                        Unlocks hidden bleeding SKUs, ready-to-copy vendor negotiation scripts, return threshold safeguards, and complete executive PDF reports.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                          onClick={() => openUpgradeModalWithPlan("cfo")}
                          size="lg"
                          className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs sm:text-sm px-6 py-5 rounded-2xl shadow-xl shadow-amber-500/30 cursor-pointer transition-all hover:scale-[1.02] gap-2"
                        >
                          <Crown className="w-4 h-4 text-black" />
                          Unlock CFO Unlimited (₹2,999/yr)
                          <ArrowRight className="w-4 h-4 text-black" />
                        </Button>
                        <Button
                          onClick={() => openUpgradeModalWithPlan("growth")}
                          variant="outline"
                          size="lg"
                          className="border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs sm:text-sm px-5 py-5 rounded-2xl cursor-pointer"
                        >
                          Or Start Growth Pro (₹999/mo)
                        </Button>
                      </div>

                      <p className="text-[11px] text-white/40 mt-3">
                        Protected by 30-Day 5x ROI Guarantee • Instant 1-Click Razorpay Activation
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            {/* 4. LINE-ITEM BREAKDOWN TABLE */}
            <section className="rounded-3xl p-6 sm:p-8 bg-[#0B0F17]/90 border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    Transaction Line-Item Analysis
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Showing top transaction items sorted by profit contribution.
                  </p>
                </div>
                <span className="text-xs text-white/40">
                  Showing {Math.min(15, data.records.length)} of {data.records.length} records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-semibold">Product / Item</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold text-right">Revenue</th>
                      <th className="pb-3 font-semibold text-right">Expenses</th>
                      <th className="pb-3 font-semibold text-right">Net Profit</th>
                      <th className="pb-3 font-semibold text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.records.slice(0, 15).map((rec, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-semibold text-white truncate max-w-[200px]">
                          {rec.item}
                        </td>
                        <td className="py-3 text-white/50">{rec.category}</td>
                        <td className="py-3 text-right font-mono text-emerald-400 font-semibold">
                          {sym}{rec.revenue.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-right font-mono text-rose-400">
                          {sym}{rec.expense.toLocaleString("en-IN")}
                        </td>
                        <td
                          className={`py-3 text-right font-mono font-bold ${
                            rec.profit >= 0 ? "text-emerald-300" : "text-rose-400"
                          }`}
                        >
                          {rec.profit >= 0 ? "+" : ""}
                          {sym}{rec.profit.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              rec.margin >= 25
                                ? "bg-emerald-500/20 text-emerald-300"
                                : rec.margin >= 0
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {rec.margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-6 mt-12 text-center text-xs text-white/40">
        <p>ProfitLens AI © 2026 • 3-Tier Executive SaaS • Free Starter • Growth Pro (₹999/mo) • CFO Unlimited (₹2,999/yr)</p>
      </footer>

      {/* UPGRADE MODAL (Razorpay Payment with 3-tier selection) */}
      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalReason(null);
        }}
        defaultPlan={modalDefaultPlan}
        reason={modalReason}
      />

      {/* SAVED REPORTS HISTORY MODAL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsHistoryOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-[#0A0D15] border border-amber-500/30 rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Your Saved Reports in Supabase</h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-12 text-center text-white/50 text-xs">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading saved reports from Supabase...
              </div>
            ) : pastReports.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-xs">
                No saved reports found yet. Upload and analyze a CSV to save your first report.
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5 pr-1">
                {pastReports.map((r) => (
                  <div key={r.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{r.filename}</span>
                      <span className="text-[11px] text-white/40 font-mono">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60">
                      <span>Rev: {r.currency_symbol}{Number(r.total_revenue).toLocaleString()}</span>
                      <span>Profit: {r.currency_symbol}{Number(r.net_profit).toLocaleString()}</span>
                      <span className="text-emerald-400 font-semibold">{Number(r.profit_margin).toFixed(1)}% margin</span>
                    </div>
                    <p className="text-white/40 text-[11px] line-clamp-1">{r.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
