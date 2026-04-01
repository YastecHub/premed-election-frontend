import React from 'react';
import { UserPlus, Vote, ArrowRight, CheckCircle, MessageCircle, Zap, Shield } from 'lucide-react';
import { PWAInstallBanner } from '../../shared/components/PWAInstallBanner';

interface VoterLandingPageProps {
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

export const VoterLandingPage: React.FC<VoterLandingPageProps> = ({
  onNavigateToRegister,
  onNavigateToLogin,
}) => {
  return (
    <>
      <PWAInstallBanner />

      <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-2">

        {/* Hero */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-5">
            <Zap className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300 tracking-wide">Pre-Med Elections 2025</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-none">
            <span className="text-zinc-100">Your Voice.</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-violet-300 to-cyan-400">
              Your Future.
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Participate in the democratic process. Register, verify your identity, and cast your vote securely.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 animation-delay-100">

          {/* Card 1 — Register & Verify */}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="bento-card group relative overflow-hidden cursor-pointer p-7 sm:p-8 flex flex-col text-left w-full"
          >
            <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-violet-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative mb-5 w-fit">
              <div className="absolute inset-0 bg-violet-600 rounded-xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-violet-500 to-violet-700 p-3.5 rounded-xl shadow-lg shadow-violet-500/25">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2 group-hover:text-violet-300 transition-colors duration-200">
              Register &amp; Verify
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              First time? Register your student details and verify your identity with OCR.
            </p>

            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'Quick registration with student details',
                'Instant OCR verification of your ID',
                'Get verified before election day',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <CheckCircle className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Non-interactive CTA label */}
            <div className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-violet-600 group-hover:bg-violet-500 text-white text-sm font-bold shadow-lg shadow-violet-500/20 transition-all duration-200">
              Register Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2 — Login to Vote */}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="bento-card group relative overflow-hidden cursor-pointer p-7 sm:p-8 flex flex-col text-left w-full"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative mb-5 w-fit">
              <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-700 p-3.5 rounded-xl shadow-lg shadow-cyan-500/20">
                <Vote className="h-7 w-7 text-white" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2 group-hover:text-cyan-300 transition-colors duration-200">
              Login to Vote
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Already registered? Enter your Matric Number to access the ballot.
            </p>

            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'Quick login with your matric number',
                'Secure, encrypted voting process',
                'Cast your vote when election is active',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 border border-zinc-700 group-hover:border-cyan-500/40 text-zinc-100 text-sm font-bold transition-all duration-200">
              Login to Vote
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3 — Security info bar */}
          <div className="md:col-span-2 bento-card flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>
                All votes are <span className="text-zinc-200 font-semibold">encrypted</span> and{' '}
                <span className="text-zinc-200 font-semibold">tamper-proof</span>. Your identity is verified before you can participate.
              </span>
            </div>
            <a
              href="https://wa.me/09068913009"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 text-emerald-400 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4" />
              Need help?
            </a>
          </div>

        </div>
      </div>
    </>
  );
};
