import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | ProfitLens AI",
  description: "Privacy Policy, Zero-Retention financial data protection, and Razorpay payment security standards for ProfitLens AI.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 16, 2026";

  return (
    <div className="min-h-screen bg-[#05070A] text-white selection:bg-amber-500/25 selection:text-amber-300">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <Shield className="w-3.5 h-3.5" />
            Compliance & Data Security
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-sm">
            Last Updated: <span className="text-white/80 font-medium">{lastUpdated}</span> • ProfitLens AI
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-10 text-white/75 text-sm sm:text-base leading-relaxed">
          {/* Executive Zero-Retention Highlight */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent border border-emerald-500/30">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  Zero-Retention Data Architecture
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  ProfitLens AI is engineered for maximum corporate confidentiality. Financial datasets and CSV files uploaded for profit leak analysis are evaluated in volatile memory during your active session and are never permanently persisted, resold, or used to train third-party public AI models.
                </p>
              </div>
            </div>
          </div>

          <section id="introduction">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              1. Introduction
            </h2>
            <p>
              Welcome to ProfitLens AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how ProfitLens AI collects, handles, processes, and safeguards information when you visit our website, register an account, or subscribe to our financial intelligence services (&quot;Services&quot;).
            </p>
            <p className="mt-2">
              By accessing or using ProfitLens AI, you consent to the collection and use of your information in accordance with this Privacy Policy and applicable data protection regulations.
            </p>
          </section>

          <section id="information-collected">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>
                <strong className="text-white">Account Information:</strong> When you register an account, we collect your email address, authentication credentials, and chosen display name via Supabase Auth.
              </li>
              <li>
                <strong className="text-white">Uploaded Financial Data:</strong> Transaction records, sales metrics, SKU costs, and overhead CSV files uploaded to the dashboard for executive profit leak analysis. These are processed ephemerally on-the-fly.
              </li>
              <li>
                <strong className="text-white">Billing & Payment Metadata:</strong> We record transaction identifiers, plan tier, billing frequency, and order status generated through our payment partner, Razorpay. We do not receive, store, or process raw credit card numbers or UPI PINs.
              </li>
              <li>
                <strong className="text-white">Usage & Diagnostic Metrics:</strong> Browser type, operating system, IP address, and high-level interaction logs used strictly to ensure platform reliability and security.
              </li>
            </ul>
          </section>

          <section id="payment-security">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              3. Payment Processing & Razorpay Security
            </h2>
            <p>
              All online payments, subscription charges, and invoices are handled through{" "}
              <strong className="text-white">Razorpay</strong> (Razorpay Software Private Limited), an RBI-authorized Payment Aggregator compliant with the Payment Card Industry Data Security Standard (PCI-DSS Level 1).
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs sm:text-sm text-white/70">
              <div className="flex items-center gap-2 text-white font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                End-to-End 256-bit TLS Encryption
              </div>
              <p>
                Your cardholder data, UPI handles, and banking credentials are submitted directly to Razorpay&apos;s hardened infrastructure. ProfitLens AI never stores or has access to your sensitive banking credentials.
              </p>
            </div>
          </section>

          <section id="data-usage">
            <h2 className="text-xl font-bold text-white mb-3">
              4. How We Use Your Information
            </h2>
            <p>We use collected data solely to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2 text-white/70">
              <li>Generate interactive profit margin reports and what-if simulation outputs.</li>
              <li>Authenticate your account and maintain access to your Pro or CFO subscription tier.</li>
              <li>Facilitate billing, renewals, and invoice generation.</li>
              <li>Deliver customer support, security updates, and critical service notifications.</li>
              <li>Detect and prevent unauthorized account access, fraud, or misuse of the platform.</li>
            </ul>
          </section>

          <section id="data-sharing">
            <h2 className="text-xl font-bold text-white mb-3">
              5. Third-Party Service Providers
            </h2>
            <p>
              We do not sell, rent, or trade your personal or financial data. We only share necessary metadata with verified, enterprise-grade service infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2 text-white/70">
              <li><strong className="text-white">Razorpay:</strong> Payment processing, order settlement, and webhook verification.</li>
              <li><strong className="text-white">Supabase:</strong> Encrypted user authentication and profile storage.</li>
              <li><strong className="text-white">Cloud Hosting (Vercel):</strong> Secure edge delivery and serverless compute.</li>
            </ul>
          </section>

          <section id="user-rights">
            <h2 className="text-xl font-bold text-white mb-3">
              6. Your Privacy Rights & Data Deletion
            </h2>
            <p>
              You have the right to request access to, rectification of, or permanent deletion of your personal account data at any time. To request account deletion or data wipe, contact us at{" "}
              <a href="mailto:support@profitlens.ai" className="text-amber-400 underline underline-offset-4 hover:text-amber-300">
                support@profitlens.ai
              </a>
              . All associated account metadata will be purged within 48 hours of verification.
            </p>
          </section>

          <section id="contact-us" className="border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white mb-3">
              7. Grievance Officer & Contact Details
            </h2>
            <p>
              In accordance with the Information Technology Act 2000 and consumer protection guidelines, if you have any questions or grievances regarding this Privacy Policy, please contact our designated Grievance & Compliance team:
            </p>
            <div className="mt-4 p-5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 text-xs sm:text-sm">
              <p className="text-white font-semibold">ProfitLens AI Compliance & Privacy Desk</p>
              <p className="text-white/70">Email: <a href="mailto:support@profitlens.ai" className="text-amber-400 hover:underline">support@profitlens.ai</a></p>
              <p className="text-white/70">Response Time: Within 24-48 business hours</p>
              <p className="text-white/70">Jurisdiction: Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <Link href="/terms" className="hover:text-amber-400 transition-colors">
            ← Terms of Service
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
