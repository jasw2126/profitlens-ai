import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, CreditCard, AlertCircle, FileCheck2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | ProfitLens AI",
  description: "Terms and conditions governing the use of ProfitLens AI software, subscriptions, and payment services.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "November 16, 2026";

  return (
    <div className="min-h-screen bg-[#05070A] text-white selection:bg-amber-500/25 selection:text-amber-300">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-white/60 text-sm">
            Last Updated: <span className="text-white/80 font-medium">{lastUpdated}</span> • ProfitLens AI
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-white/75 text-sm sm:text-base leading-relaxed">
          <section id="agreement">
            <h2 className="text-xl font-bold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By visiting, registering an account on, or purchasing a subscription to ProfitLens AI (&quot;ProfitLens,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you (&quot;Customer,&quot; &quot;User,&quot; or &quot;you&quot;) agree to be legally bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our services immediately.
            </p>
          </section>

          <section id="services">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-400" />
              2. Description of Services & Digital Delivery
            </h2>
            <p>
              ProfitLens AI operates a Software-as-a-Service (SaaS) financial analytics and margin bleed detection command center. Services include interactive profit calculators, what-if scenario simulators, silent margin bleed analyzers, and automated executive CFO recovery blueprints.
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-white/70">
              <strong className="text-white block mb-1">Instant Digital Fulfillment:</strong>
              ProfitLens AI is a 100% digital web application. Upon successful payment verification via Razorpay, paid features, plan upgrades, and Pro Vault capabilities are provisioned instantly and made accessible through your dashboard in real-time. No physical goods are shipped.
            </div>
          </section>

          <section id="accounts">
            <h2 className="text-xl font-bold text-white mb-3">
              3. User Accounts & Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>You must provide accurate, current, and complete registration details.</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
              <li>You agree not to upload harmful code, reverse-engineer proprietary algorithms, or use the platform for fraudulent or unlawful activities.</li>
            </ul>
          </section>

          <section id="pricing-payments">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              4. Pricing, Billing & Payment Processing
            </h2>
            <p>
              Pricing for ProfitLens AI subscriptions (such as Growth Plan at ₹999/month and CFO Command Center at ₹2,999/year) is listed in Indian Rupees (INR) and billed in advance.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-white/70">
              <li>
                <strong className="text-white">Payment Gateway:</strong> All payments are securely processed through <strong className="text-white">Razorpay</strong>. We accept major credit cards, debit cards, UPI, net banking, and supported wallets.
              </li>
              <li>
                <strong className="text-white">Auto-Renewal & Invoices:</strong> Recurring subscriptions renew automatically at the end of each billing cycle unless cancelled prior to the renewal date. Tax invoices are delivered digitally via email.
              </li>
              <li>
                <strong className="text-white">Taxes:</strong> All applicable Goods and Services Tax (GST) or statutory levies will be calculated and displayed clearly at checkout.
              </li>
            </ul>
          </section>

          <section id="disclaimer">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              5. Financial Advisory Disclaimer
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300 block mb-1">Algorithmic Decision Support Only:</strong>
              ProfitLens AI provides analytical models, heuristic benchmarks, and software-generated projections based on data provided by you. ProfitLens AI is NOT a registered financial investment advisor, certified auditor, or statutory tax consultant. Calculations and insights should be verified by your certified accounting team before executing capital expenditures or restructuring operations.
            </div>
          </section>

          <section id="intellectual-property">
            <h2 className="text-xl font-bold text-white mb-3">
              6. Intellectual Property
            </h2>
            <p>
              All software interfaces, user design components, algorithms, logos, and brand assets associated with ProfitLens AI are the exclusive intellectual property of ProfitLens AI. You retain full ownership and intellectual rights over any proprietary financial data and CSV files you upload for evaluation.
            </p>
          </section>

          <section id="termination">
            <h2 className="text-xl font-bold text-white mb-3">
              7. Cancellation & Termination
            </h2>
            <p>
              You may cancel your subscription or delete your account at any time. For detailed information regarding refunds, please review our dedicated{" "}
              <Link href="/refund-policy" className="text-amber-400 underline underline-offset-4 hover:text-amber-300">
                Refund & Cancellation Policy
              </Link>
              . We reserve the right to suspend accounts that violate these terms or engage in fraudulent activities.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-xl font-bold text-white mb-3">
              8. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms of Service and any contractual disputes arising out of or related to ProfitLens AI shall be governed by and construed in accordance with the laws of the Republic of India. The courts of Bengaluru, Karnataka, India shall have exclusive jurisdiction over any disputes.
            </p>
          </section>

          <section id="contact-info" className="border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white mb-3">
              9. Contact Information
            </h2>
            <p>For questions or support regarding these Terms of Service, please reach out to:</p>
            <div className="mt-4 p-5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 text-xs sm:text-sm">
              <p className="text-white font-semibold">ProfitLens AI Legal & Corporate Relations</p>
              <p className="text-white/70">Support & Billing: <a href="mailto:support@profitlens.ai" className="text-amber-400 hover:underline">support@profitlens.ai</a></p>
              <p className="text-white/70">Location: Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <Link href="/privacy" className="hover:text-amber-400 transition-colors">
            ← Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
            Refund & Cancellation Policy →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
