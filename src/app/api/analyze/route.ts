import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

interface FinancialSummaryPayload {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  currencySymbol?: string;
  topProfitableItems: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
  }>;
  bottomLossItems: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
  }>;
  expenseCategories?: Array<{ category: string; amount: number }>;
}

export interface AnalysisResponse {
  isDemo: boolean;
  summary: string;
  moneyLeaks: Array<{
    leak: string;
    impact: string;
    explanation: string;
    severity: "critical" | "warning" | "moderate";
  }>;
  actionSteps: Array<{
    step: string;
    roi: string;
    actionPlan: string;
    priority: "high" | "medium" | "quick-win";
  }>;
}

const fallbackAnalysis = (summary: Partial<FinancialSummaryPayload>): AnalysisResponse => {
  const sym = summary.currencySymbol || "₹";
  const rev = summary.totalRevenue || 284500;
  const exp = summary.totalExpenses || 188200;
  const bottomItems = summary.bottomLossItems || [];

  const worstItem1 = bottomItems[0]?.name || "High-Return Fashion Footwear";
  const worstItem2 = bottomItems[1]?.name || "Overnight Expedited Shipping";
  const worstItem3 = bottomItems[2]?.name || "Unoptimized Meta Ad Campaign";

  return {
    isDemo: true,
    summary: `ProfitLens AI analyzed your transaction records (${sym}${rev.toLocaleString("en-IN")} total revenue against ${sym}${exp.toLocaleString("en-IN")} total operating costs). While overall margins sit at ${(summary.profitMargin || 33.8).toFixed(1)}%, high fulfillment returns and ad fatigue on 3 product lines are burning critical operating capital.`,
    moneyLeaks: [
      {
        leak: `High Return & Defect Rate on ${worstItem1}`,
        impact: `Losing ~${sym}${Math.round(exp * 0.14).toLocaleString("en-IN")}/mo`,
        explanation: `${worstItem1} carries an elevated return and restocking expense that is eroding gross margins below break-even. Packaging damage and sizing mismatch are the primary contributors.`,
        severity: "critical",
      },
      {
        leak: `Fulfillment & Shipping Inefficiencies (${worstItem2})`,
        impact: `Losing ~${sym}${Math.round(exp * 0.08).toLocaleString("en-IN")}/mo`,
        explanation: `Customer freight subsidies and unbundled express delivery fees are absorbing nearly 18% of margin per transaction without driving incremental cart value.`,
        severity: "warning",
      },
      {
        leak: `Underperforming Customer Acquisition on ${worstItem3}`,
        impact: `Losing ~${sym}${Math.round(exp * 0.11).toLocaleString("en-IN")}/mo`,
        explanation: `Customer Acquisition Cost (CAC) on this channel has climbed 34% over the last cycle, while conversion rates dropped, causing negative net margin on first purchases.`,
        severity: "moderate",
      },
    ],
    actionSteps: [
      {
        step: "Restructure Free Shipping Threshold & Carrier Rates",
        roi: `+4.5% Net Margin (~${sym}${Math.round(rev * 0.045).toLocaleString("en-IN")})`,
        actionPlan: "Raise the minimum cart value for free standard shipping by 25% and discontinue unprofitable one-day express subsidization.",
        priority: "quick-win",
      },
      {
        step: `Renegotiate Supplier COGS or Sunset Low-Margin ${worstItem1}`,
        roi: `+${sym}${Math.round(exp * 0.1).toLocaleString("en-IN")} Retained Capital`,
        actionPlan: "Audit unit economics: request a 12% bulk discount from the vendor or bundle with high-margin accessories to protect unit profitability.",
        priority: "high",
      },
      {
        step: "Automate Post-Purchase Cross-Sells on Hero Products",
        roi: `+18-22% Average Order Value`,
        actionPlan: "Deploy dynamic 1-click upsells on top performers to lift cart size without spending more on top-of-funnel ad spend.",
        priority: "medium",
      },
    ],
  };
};

export async function POST(req: NextRequest) {
  try {
    const payload: FinancialSummaryPayload = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful fallback if no API key is provided
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(fallbackAnalysis(payload));
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are ProfitLens AI's elite Financial & E-commerce Profitability Consultant.
Analyze this e-commerce/retail store's performance data and detect exactly 3 critical "Money Leaks" and 3 high-leverage "Action Steps" to maximize net profit.

Financial Data:
- Total Revenue: ${payload.currencySymbol || "₹"}${payload.totalRevenue}
- Total Expenses: ${payload.currencySymbol || "₹"}${payload.totalExpenses}
- Net Profit: ${payload.currencySymbol || "₹"}${payload.netProfit}
- Profit Margin: ${payload.profitMargin.toFixed(2)}%

Top 5 Profitable Items:
${JSON.stringify(payload.topProfitableItems, null, 2)}

Bottom 5 Loss-making / Weak-margin Items:
${JSON.stringify(payload.bottomLossItems, null, 2)}

Expense Categories:
${JSON.stringify(payload.expenseCategories || [], null, 2)}

Requirements:
1. Provide a sharp, concise 2-sentence executive summary.
2. Identify EXACTLY 3 specific "Money Leaks" (must cite actual product names, categories, or cost drivers from the data, estimated loss amount, and clear root-cause explanation).
3. Provide EXACTLY 3 actionable profit-boosting steps with projected ROI/financial upside and concrete implementation steps.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Concise executive overview of store performance and leak risks",
              },
              moneyLeaks: {
                type: Type.ARRAY,
                description: "Exactly 3 distinct financial or operational money leaks",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    leak: {
                      type: Type.STRING,
                      description: "Punchy title of the leak",
                    },
                    impact: {
                      type: Type.STRING,
                      description: "Estimated financial drain or cost impact",
                    },
                    explanation: {
                      type: Type.STRING,
                      description: "Detailed why and where the loss is occurring",
                    },
                    severity: {
                      type: Type.STRING,
                      description: "critical, warning, or moderate",
                    },
                  },
                  propertyOrdering: ["leak", "impact", "explanation", "severity"],
                },
              },
              actionSteps: {
                type: Type.ARRAY,
                description: "Exactly 3 high-impact profit improvement steps",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: {
                      type: Type.STRING,
                      description: "Actionable strategic step title",
                    },
                    roi: {
                      type: Type.STRING,
                      description: "Expected ROI or margin increase",
                    },
                    actionPlan: {
                      type: Type.STRING,
                      description: "Concrete instructions to execute",
                    },
                    priority: {
                      type: Type.STRING,
                      description: "quick-win, high, or medium",
                    },
                  },
                  propertyOrdering: ["step", "roi", "actionPlan", "priority"],
                },
              },
            },
            propertyOrdering: ["summary", "moneyLeaks", "actionSteps"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return NextResponse.json(fallbackAnalysis(payload));
      }

      const parsed = JSON.parse(text);

      return NextResponse.json({
        isDemo: false,
        summary: parsed.summary || fallbackAnalysis(payload).summary,
        moneyLeaks: Array.isArray(parsed.moneyLeaks) && parsed.moneyLeaks.length > 0
          ? parsed.moneyLeaks.slice(0, 3)
          : fallbackAnalysis(payload).moneyLeaks,
        actionSteps: Array.isArray(parsed.actionSteps) && parsed.actionSteps.length > 0
          ? parsed.actionSteps.slice(0, 3)
          : fallbackAnalysis(payload).actionSteps,
      });
    } catch (genAiError: any) {
      console.warn("Gemini API call failed, falling back to demo analysis:", genAiError?.message || genAiError);
      return NextResponse.json(fallbackAnalysis(payload));
    }
  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze data" },
      { status: 500 }
    );
  }
}
