import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Detect missing or placeholder Razorpay keys
    const isPlaceholder =
      !keyId ||
      !keySecret ||
      keyId.trim() === "" ||
      keySecret.trim() === "" ||
      keyId.includes("your_key") ||
      keyId.includes("rzp_test_your_key_id_here") ||
      keySecret.includes("your_key_secret_here");

    if (isPlaceholder) {
      return NextResponse.json(
        {
          error: "Razorpay credentials are unconfigured or placeholder.",
          isPlaceholder: true,
          message:
            "NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are still placeholders in .env.local. Add your valid Razorpay Test or Live Key ID and Key Secret to process orders.",
        },
        { status: 400 }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional; fallback defaults are used below
    }

    // Dynamic 3-tier pricing support:
    // Growth Pro: ₹999/mo (99900 paise)
    // CFO Unlimited: ₹2,999/yr (299900 paise)
    const planId = body?.planId || (body?.amount === 99900 ? "growth" : "cfo");
    const amount = planId === "growth" ? 99900 : (Number(body?.amount) || 299900);
    const currency = body?.currency || "INR";

    const isGrowth = planId === "growth";
    const tierName = isGrowth ? "Growth Pro Tier" : "CFO Unlimited Tier";
    const billingCycle = isGrowth ? "monthly" : "yearly";
    const formattedPrice = isGrowth ? "₹999/month" : "₹2,999/year";

    const razorpay = new Razorpay({
      key_id: keyId!,
      key_secret: keySecret!,
    });

    const options = {
      amount,
      currency,
      receipt: `rcpt_${planId}_${Date.now()}`,
      notes: {
        planId,
        planName: tierName,
        billing: billingCycle,
        priceDisplay: formattedPrice,
        ...body?.notes,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: keyId,
      planId,
      tierName,
      order,
    });
  } catch (error: any) {
    console.error("[Razorpay API] Error creating order:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to create Razorpay order",
        details: error,
      },
      { status: 500 }
    );
  }
}
