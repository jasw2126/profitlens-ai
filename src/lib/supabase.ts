import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js";

/**
 * Expected schema for the Supabase 'reports' table:
 * 
 * CREATE TABLE IF NOT EXISTS public.reports (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
 *   user_email TEXT,
 *   filename TEXT NOT NULL,
 *   total_revenue NUMERIC NOT NULL,
 *   total_expenses NUMERIC NOT NULL,
 *   net_profit NUMERIC NOT NULL,
 *   profit_margin NUMERIC NOT NULL,
 *   currency_symbol TEXT DEFAULT '₹',
 *   summary TEXT,
 *   money_leaks JSONB,
 *   action_steps JSONB,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Enable RLS
 * ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
 * 
 * -- RLS Policies:
 * CREATE POLICY "Users can insert their own reports"
 *   ON public.reports FOR INSERT
 *   WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
 * 
 * CREATE POLICY "Users can view their own reports"
 *   ON public.reports FOR SELECT
 *   USING (auth.uid() = user_id OR user_id IS NULL);
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Validates whether Supabase environment variables are provided and not placeholders.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  
  const trimmedUrl = supabaseUrl.trim();
  const trimmedKey = supabaseAnonKey.trim();

  if (
    trimmedUrl === "" ||
    trimmedKey === "" ||
    trimmedUrl.includes("your-project-id") ||
    trimmedKey.includes("your-anon-key-here")
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmedUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Singleton client or null if unconfigured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface ReportSavePayload {
  userId?: string | null;
  userEmail?: string | null;
  filename: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  currencySymbol: string;
  summary: string;
  moneyLeaks: any[];
  actionSteps: any[];
}

export interface ReportRecord {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  filename: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  currency_symbol: string;
  summary: string;
  money_leaks: any[];
  action_steps: any[];
  created_at: string;
}

/**
 * Saves a CSV analysis summary to the Supabase "reports" table.
 * Gracefully skips database writes if Supabase credentials are not configured or invalid.
 */
export async function saveReportToSupabase(
  report: ReportSavePayload
): Promise<{ success: boolean; id?: string; skipped?: boolean; error?: string }> {
  // Graceful degradation when Supabase is not configured yet
  if (!isSupabaseConfigured() || !supabase) {
    console.info(
      "[Supabase] Gracefully skipping database write: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are not configured yet."
    );
    return {
      success: false,
      skipped: true,
      error: "Supabase keys not configured in .env.local",
    };
  }

  try {
    const insertPayload = {
      user_id: report.userId || null,
      user_email: report.userEmail || null,
      filename: report.filename || "Store_Analysis.csv",
      total_revenue: report.totalRevenue,
      total_expenses: report.totalExpenses,
      net_profit: report.netProfit,
      profit_margin: report.profitMargin,
      currency_symbol: report.currencySymbol || "₹",
      summary: report.summary,
      money_leaks: report.moneyLeaks || [],
      action_steps: report.actionSteps || [],
    };

    const { data, error } = await supabase
      .from("reports")
      .insert([insertPayload])
      .select("id")
      .single();

    if (error) {
      console.warn("[Supabase] Notice when inserting into 'reports' table:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.warn("[Supabase] Unexpected error saving report to database:", err?.message || err);
    return { success: false, error: err?.message || "Unknown error saving report" };
  }
}

/**
 * Fetches saved reports for a given user from the Supabase "reports" table.
 */
export async function fetchUserReports(userId: string): Promise<ReportRecord[]> {
  if (!isSupabaseConfigured() || !supabase || !userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[Supabase] Failed to fetch user reports:", error.message);
      return [];
    }

    return (data as ReportRecord[]) || [];
  } catch (err) {
    console.warn("[Supabase] Exception fetching reports:", err);
    return [];
  }
}
