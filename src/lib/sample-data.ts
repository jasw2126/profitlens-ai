export const SAMPLE_STORE_CSV = `Date,Item,Category,Revenue,Expense,Units Sold
2026-10-01,Wireless ANC Headphones,Electronics,45000,24000,15
2026-10-02,Organic Cotton Hoodie,Apparel,28000,12500,20
2026-10-03,Vintage Denim Jacket,Apparel,34000,19500,17
2026-10-04,Ergonomic Gaming Mouse,Electronics,22500,11000,18
2026-10-05,UltraFast 65W GaN Charger,Electronics,18000,7200,25
2026-10-06,Stainless Steel Thermal Tumbler,Home & Living,16500,6800,22
2026-10-07,Premium Leather Wallet,Accessories,19200,8600,16
2026-10-08,Overnight Priority Express Shipping,Logistics,12000,18400,30
2026-10-09,Facebook Meta Ads Retargeting,Marketing,0,26500,1
2026-10-10,Custom Branded Rigid Box Packaging,Packaging,6500,11200,45
2026-10-11,Defective Sneaker Batch Restock,Footwear,14000,21500,10
2026-10-12,Active Noise Buds Pro,Electronics,38000,19000,19
2026-10-13,Polarized UV Sunglasses,Accessories,15400,5200,22
2026-10-14,Google Performance Max Ads,Marketing,0,16000,1
2026-10-15,Minimalist Felt Desk Mat,Office,15400,6000,28`;

export interface TransactionRecord {
  date: string;
  item: string;
  category: string;
  revenue: number;
  expense: number;
  units: number;
  profit: number;
  margin: number;
}
