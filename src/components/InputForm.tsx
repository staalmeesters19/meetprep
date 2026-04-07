"use client";
import { useState } from "react";

interface InputFormProps {
  onSubmit: (company: string, persons: string[]) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [company, setCompany] = useState("");
  const [personsText, setPersonsText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const persons = personsText
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (company && persons.length > 0) {
      onSubmit(company, persons);
    }
  };

  const isValid = company.trim() && personsText.trim();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 p-6 space-y-4">
        <div>
          <label htmlFor="company" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Bedrijf
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="bijv. Agyle BV"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="persons" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Deelnemers
            <span className="font-normal normal-case tracking-normal text-slate-300 ml-1">
              komma-gescheiden
            </span>
          </label>
          <textarea
            id="persons"
            value={personsText}
            onChange={(e) => setPersonsText(e.target.value)}
            placeholder="bijv. Abdul Malik"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition resize-none"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Bezig...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Genereer voorbereiding
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
