"use client";
import Image from "next/image";
import InputForm from "@/components/InputForm";
import StreamingResult from "@/components/StreamingResult";
import { useStreamingGeneration } from "@/hooks/useStreamingGeneration";

export default function Home() {
  const {
    isLoading,
    isSearching,
    error,
    fullText,
    remaining,
    isDone,
    generate,
  } = useStreamingGeneration();

  const hasResult = fullText.length > 0 || isLoading;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Gradient header bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 animate-gradient" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/agyle-logo.png"
              alt="Agyle"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">MeetPrep</h1>
              <p className="text-[10px] text-slate-400 leading-tight">by Agyle</p>
            </div>
          </div>
          {remaining !== null && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {remaining} over vandaag
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero + Form */}
        {!hasResult && (
          <div className="pt-24 pb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-6">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Gratis — 3 voorbereidingen per dag
              </div>
              <h2 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-[1.1]">
                Ken je gesprekspartners
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  voor je binnenloopt
                </span>
              </h2>
              <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                Vul een bedrijfsnaam en namen in. Krijg een complete briefing
                met bedrijfsinfo, persoonlijke profielen en gespreksvoorbereiding.
              </p>
            </div>
            <InputForm onSubmit={generate} isLoading={isLoading} />

            {/* Social proof / feature pills */}
            <div className="flex items-center justify-center gap-6 mt-12 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                30 seconden
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                LinkedIn data
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Privacyveilig
              </div>
            </div>
          </div>
        )}

        {/* Loading state - searching */}
        {isSearching && (
          <div className="pt-16 animate-fade-in-up">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Informatie verzamelen...</p>
                  <p className="text-xs text-slate-400">Bedrijfsdata en LinkedIn profielen ophalen</p>
                </div>
              </div>

              {/* Skeleton cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
                  <div className="h-4 w-32 rounded-full animate-shimmer mb-4" />
                  <div className="space-y-2.5">
                    <div className="h-3 w-full rounded-full animate-shimmer" />
                    <div className="h-3 w-4/5 rounded-full animate-shimmer" />
                    <div className="h-3 w-3/5 rounded-full animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6 animate-fade-in-up">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-red-600 hover:text-red-800 mt-1 font-medium cursor-pointer"
                >
                  Probeer opnieuw
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Streaming result */}
        {!isSearching && (
          <StreamingResult
            fullText={fullText}
            isLoading={isLoading}
            isSearching={isSearching}
            isDone={isDone}
          />
        )}

        {/* Done actions */}
        {isDone && (
          <div className="flex items-center justify-center gap-4 mt-8 mb-16 animate-fade-in-up">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Nieuwe voorbereiding
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/agyle-logo.png"
              alt="Agyle"
              width={20}
              height={20}
              className="opacity-40"
            />
            <span className="text-xs text-slate-300">
              Made by <span className="text-slate-400 font-medium">Agyle</span> — AI Implementatie &amp; Automatisering
            </span>
          </div>
          <span className="text-xs text-slate-300">
            Powered by Claude AI
          </span>
        </div>
      </footer>
    </div>
  );
}
