import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RefreshCcw, ShieldCheck, Clock, CheckCircle2, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Cancellation & Refund Policy | ProfitLens AI",
  description: "Cancellation terms, 7-day money-back guarantee, and Razorpay refund processing timelines for ProfitLens AI.",
};

export default function RefundPolicyPage() {
  const lastUpdated = "November 16, 2026";

  return (
    <div className="min-h-screen bg-[#05070A] text-white selection:bg-amber-500/25 selection:text-amber-300">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <RefreshCcw className="w-3.5 h-3.5" />
            Customer Protection & Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Cancellation & Refund Policy
          </h1>
          <p className="text-white/60 text-sm">
            Last Updated: <span className="text-white/80 font-medium">{lastUpdated}</span> • ProfitLens AI
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-white/75 text-sm sm:text-base leading-relaxed">
          {/* Quick Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <ShieldCheck className="w-5 h-5" />
                7-Day Money-Back Guarantee
              </div>
              <p className="text-xs sm:text-sm text-white/70">
                If ProfitLens AI does not uncover actionable margin leaks or savings potential within your first 7 days, email us for a full 100% refund without friction.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                <Clock className="w-5 h-5" />
                5–7 Business Days Processing
              </div>
              <p className="text-xs sm:text-sm text-white/70">
                Once approved, refunds are credited back to the original payment source (bank account, UPI, or card) via Razorpay within 5–7 banking business days.
              </p>
            </div>
          </div>

          <section id="cancellation-policy">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-amber-400" />
              1. Subscription Cancellation
            </h2>
            <p>
              You may cancel your ProfitLens AI subscription at any time. When you cancel:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-white/70">
              <li>
                <strong className="text-white">Active Period Access:</strong> You will retain full access to all paid features (Pro Vault, unlimited simulations, CSV export) until the conclusion of your current paid billing period.
              </li>
              <li>
                <strong className="text-white">No Future Billing:</strong> Your account will not be charged on subsequent billing cycles once cancellation is confirmed.
              </li>
              <li>
                <strong className="text-white">How to Cancel:</strong> You can initiate cancellation from your account dashboard or by submitting a cancellation request with your registered email to{" "}
                <a href="mailto:support@profitlens.ai" className="text-amber-400 hover:underline">
                  support@profitlens.ai
                </a>
                .
              </li>
            </ul>
          </section>

          <section id="refund-eligibility">
            <h2 className="text-xl font-bold text-white mb-3">
              2. Refund Eligibility & Scenarios
            </h2>
            <p>We provide full refunds under the following circumstances:</p>
            <div className="space-y-3 mt-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs sm:text-sm">
                <strong className="text-white block mb-1">A. Initial 7-Day Money-Back Period</strong>
                First-time subscribers to our Growth Plan or CFO Command Center tier are eligible for a no-questions-asked refund if requested within 7 calendar days of the original purchase.
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs sm:text-sm">
                <strong className="text-white block mb-1">B. Duplicate or Erroneous Transactions</strong>
                If your card or UPI account was charged multiple times due to a network glitch or gateway timeout during checkout, duplicate charges will be refunded in full immediately upon confirmation.
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs sm:text-sm">
                <strong className="text-white block mb-1">C. Technical Unavailability</strong>
                In the rare event of prolonged service failure or technical inability to deliver your paid plan tier that cannot be resolved within 48 hours of reporting, a prorated or full refund will be provided.
              </div>
            </div>
          </section>

          <section id="roi-guarantee">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              3. 5x ROI Guarantee
            </h2>
            <p>
              We stand firmly behind the precision of our profit intelligence algorithms. If your business actively uses the ProfitLens CFO Command Center on verified financial statements and fails to identify at least 5x the cost of your annual subscription in margin leaks, dormant vendor expenses, or recoverable cash within 30 days, our executive team will refund your annual subscription in full upon reviewing your basic setup.
            </p>
          </section>

          <section id="refund-process">
            <h2 className="text-xl font-bold text-white mb-3">
              4. Refund Request Process & Razorpay Timelines
            </h2>
            <p>
              To ensure speedy handling, follow these simple steps to submit a refund request:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-2 text-white/70">
              <li>
                Send an email to <a href="mailto:support@profitlens.ai" className="text-amber-400 hover:underline">support@profitlens.ai</a> with the subject line <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-amber-300">Refund Request - [Your Registered Email]</code>.
              </li>
              <li>
                Include your <strong className="text-white">Razorpay Payment ID</strong> (starts with <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-amber-300">pay_...</code>) or invoice number.
              </li>
              <li>
                Our billing team will review and approve eligible requests within <strong className="text-white">24 hours</strong>.
              </li>
              <li>
                Once approved, the refund instruction is dispatched directly via the <strong className="text-white">Razorpay Payment Gateway API</strong>. Funds will reflect in your original payment method (Credit/Debit Card, Net Banking, or UPI) within <strong className="text-white">5 to 7 banking business days</strong> in accordance with standard bank clearing cycles.
              </li>
            </ol>
          </section>

          <section id="exceptions">
            <h2 className="text-xl font-bold text-white mb-3">
              5. Non-Refundable Situations
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-white/70">
              <li>Requests submitted outside the stated 7-day money-back guarantee window.</li>
              <li>Accounts terminated due to violations of our Acceptable Use Policy or fraudulent exploitation.</li>
              <li>Disputes initiated via third-party chargeback before contacting our support team.</li>
            </ul>
          </section>

          <section id="support-contact" className="border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              6. Need Assistance?
            </h2>
            <p>Our dedicated support and billing team is on standby to assist you:</p>
            <div className="mt-4 p-5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 text-xs sm:text-sm">
              <p className="text-white font-semibold">ProfitLens AI Support & Billing Desk</p>
              <p className="text-white/70">Email: <a href="mailto:support@profitlens.ai" className="text-amber-400 hover:underline">support@profitlens.ai</a></p>
              <p className="text-white/70">Working Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
              <p className="text-white/70">Response Time: Under 12 hours</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <Link href="/privacy" className="hover:text-amber-400 transition-colors">
            ← Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-amber-400 transition-colors">
            Terms of Service →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
