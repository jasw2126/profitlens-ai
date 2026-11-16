import Papa from "papaparse";
import { TransactionRecord } from "./sample-data";

export interface ParsedStoreData {
  records: TransactionRecord[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  currencySymbol: string;
  itemsComparison: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
  }>;
  timelineComparison: Array<{
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
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
  expenseCategories: Array<{
    category: string;
    amount: number;
  }>;
}

// Clean and extract numeric value from currency strings like "₹ 14,000", "$520.50", "(200)"
function cleanNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;

  let str = String(val).trim();
  if (!str) return 0;

  // Handle accounting negative format: (1200) -> -1200
  let isNegative = false;
  if (str.startsWith("(") && str.endsWith(")")) {
    isNegative = true;
    str = str.slice(1, -1);
  }

  // Remove currency signs, commas, whitespace
  const sanitized = str.replace(/[^0-9.-]/g, "");
  const num = parseFloat(sanitized);

  if (isNaN(num)) return 0;
  return isNegative ? -Math.abs(num) : num;
}

function detectCurrency(text: string): string {
  if (text.includes("₹") || text.toLowerCase().includes("inr")) return "₹";
  if (text.includes("$") || text.toLowerCase().includes("usd")) return "$";
  if (text.includes("€") || text.toLowerCase().includes("eur")) return "€";
  if (text.includes("£") || text.toLowerCase().includes("gbp")) return "£";
  return "₹";
}

export function parseCSVData(csvContent: string): ParsedStoreData {
  const currencySymbol = detectCurrency(csvContent);

  const parsed = Papa.parse<Record<string, any>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const rows = parsed.data;
  if (!rows || rows.length === 0) {
    throw new Error("No data found in the CSV file.");
  }

  // Find column keys
  const firstRow = rows[0];
  const keys = Object.keys(firstRow);

  const findKey = (possibleNames: string[]): string | undefined => {
    return keys.find((k) =>
      possibleNames.some((name) => k.toLowerCase().trim() === name.toLowerCase())
    );
  };

  const revenueKey =
    findKey(["revenue", "sales", "total sales", "amount", "price", "income", "turnover", "gross sales"]) ||
    keys.find((k) => k.toLowerCase().includes("rev") || k.toLowerCase().includes("sale"));

  const expenseKey =
    findKey(["expense", "expenses", "cost", "cogs", "cost of goods", "spend", "fees", "expenditure"]) ||
    keys.find((k) => k.toLowerCase().includes("cost") || k.toLowerCase().includes("exp"));

  const itemKey =
    findKey(["item", "product", "product name", "item name", "sku", "description", "title", "name"]) ||
    keys.find((k) => k.toLowerCase().includes("prod") || k.toLowerCase().includes("item")) ||
    keys[1] ||
    keys[0];

  const dateKey =
    findKey(["date", "timestamp", "day", "created at", "order date", "period", "month"]) ||
    keys.find((k) => k.toLowerCase().includes("date"));

  const categoryKey =
    findKey(["category", "type", "department", "group", "tag"]) ||
    keys.find((k) => k.toLowerCase().includes("cat"));

  const unitsKey =
    findKey(["units sold", "units", "quantity", "qty", "count"]) ||
    keys.find((k) => k.toLowerCase().includes("qty") || k.toLowerCase().includes("unit"));

  const records: TransactionRecord[] = [];
  const itemMap: Map<string, { revenue: number; expenses: number }> = new Map();
  const dateMap: Map<string, { revenue: number; expenses: number }> = new Map();
  const categoryMap: Map<string, number> = new Map();

  let totalRev = 0;
  let totalExp = 0;

  rows.forEach((row: Record<string, any>, idx: number) => {
    const rawItem = itemKey ? String(row[itemKey] || `Item #${idx + 1}`).trim() : `Item #${idx + 1}`;
    if (!rawItem) return;

    const rawRevenue = revenueKey ? cleanNumber(row[revenueKey]) : 0;
    const rawExpense = expenseKey ? cleanNumber(row[expenseKey]) : 0;
    const rawDate = dateKey && row[dateKey] ? String(row[dateKey]).trim() : `Row ${idx + 1}`;
    const rawCat = categoryKey && row[categoryKey] ? String(row[categoryKey]).trim() : "General";
    const rawUnits = unitsKey ? cleanNumber(row[unitsKey]) : 1;

    const profit = rawRevenue - rawExpense;
    const margin = rawRevenue > 0 ? (profit / rawRevenue) * 100 : profit < 0 ? -100 : 0;

    totalRev += rawRevenue;
    totalExp += rawExpense;

    records.push({
      date: rawDate,
      item: rawItem,
      category: rawCat,
      revenue: rawRevenue,
      expense: rawExpense,
      units: rawUnits,
      profit,
      margin,
    });

    // Aggregate by item
    const existingItem = itemMap.get(rawItem) || { revenue: 0, expenses: 0 };
    existingItem.revenue += rawRevenue;
    existingItem.expenses += rawExpense;
    itemMap.set(rawItem, existingItem);

    // Aggregate by date
    const existingDate = dateMap.get(rawDate) || { revenue: 0, expenses: 0 };
    existingDate.revenue += rawRevenue;
    existingDate.expenses += rawExpense;
    dateMap.set(rawDate, existingDate);

    // Aggregate by category
    const existingCat = categoryMap.get(rawCat) || 0;
    categoryMap.set(rawCat, existingCat + rawExpense);
  });

  const netProfit = totalRev - totalExp;
  const profitMargin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

  // Process item comparison
  const itemsComparison = Array.from(itemMap.entries()).map(([name, data]) => {
    const profit = data.revenue - data.expenses;
    const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : profit < 0 ? -100 : 0;
    return {
      name,
      revenue: Math.round(data.revenue),
      expenses: Math.round(data.expenses),
      profit: Math.round(profit),
      margin: Math.round(margin * 10) / 10,
    };
  });

  // Sort by revenue descending for primary chart view
  const sortedByRev = [...itemsComparison].sort((a, b) => b.revenue - a.revenue);

  // Top 5 profitable items
  const topProfitable = [...itemsComparison].sort((a, b) => b.profit - a.profit).slice(0, 5);

  // Bottom 5 lowest profit / highest loss items
  const bottomLoss = [...itemsComparison].sort((a, b) => a.profit - b.profit).slice(0, 5);

  // Process timeline
  const timelineComparison = Array.from(dateMap.entries()).map(([date, data]) => ({
    date,
    revenue: Math.round(data.revenue),
    expenses: Math.round(data.expenses),
    profit: Math.round(data.revenue - data.expenses),
  }));

  // Process categories
  const expenseCategories = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount: Math.round(amount),
  }));

  return {
    records,
    totalRevenue: Math.round(totalRev),
    totalExpenses: Math.round(totalExp),
    netProfit: Math.round(netProfit),
    profitMargin: Math.round(profitMargin * 10) / 10,
    currencySymbol,
    itemsComparison: sortedByRev.slice(0, 8),
    timelineComparison: timelineComparison.slice(0, 15),
    topProfitableItems: topProfitable,
    bottomLossItems: bottomLoss,
    expenseCategories,
  };
}
