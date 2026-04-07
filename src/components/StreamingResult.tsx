"use client";
import ReactMarkdown from "react-markdown";

interface StreamingResultProps {
  fullText: string;
  isLoading: boolean;
  isSearching: boolean;
  isDone: boolean;
}

function parseSection(text: string, marker: string, nextMarkers: string[]): string {
  const startIdx = text.indexOf(marker);
  if (startIdx === -1) return "";
  const contentStart = startIdx + marker.length;
  let endIdx = text.length;
  for (const next of nextMarkers) {
    const idx = text.indexOf(next, contentStart);
    if (idx !== -1 && idx < endIdx) endIdx = idx;
  }
  return text.slice(contentStart, endIdx).trim();
}

function extractPersonSections(text: string): { name: string; content: string }[] {
  const persons: { name: string; content: string }[] = [];
  const regex = /===PERSON:(.+?)===/g;
  let match;
  const indices: { name: string; start: number }[] = [];

  while ((match = regex.exec(text)) !== null) {
    indices.push({ name: match[1], start: match.index + match[0].length });
  }

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].start;
    const nextPerson = i + 1 < indices.length
      ? indices[i + 1].start - `===PERSON:${indices[i + 1].name}===`.length
      : text.length;
    const meetingPrep = text.indexOf("===MEETING_PREP===", start);
    const endMarker = text.indexOf("===END===", start);
    const end = Math.min(
      nextPerson,
      meetingPrep !== -1 ? meetingPrep : text.length,
      endMarker !== -1 ? endMarker : text.length
    );
    persons.push({ name: indices[i].name, content: text.slice(start, end).trim() });
  }
  return persons;
}

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-violet-500 to-violet-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
    "from-cyan-500 to-cyan-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function SectionLabel({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
  };
  return (
    <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${bgColors[color]}`}>
      {icon}
      {label}
    </div>
  );
}

export default function StreamingResult({ fullText, isLoading, isDone }: StreamingResultProps) {
  if (!fullText) return null;

  const companyContent = parseSection(fullText, "===COMPANY===", ["===PERSON:", "===MEETING_PREP===", "===END==="]);
  const persons = extractPersonSections(fullText);
  const meetingContent = parseSection(fullText, "===MEETING_PREP===", ["===END==="]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-8 pb-4">
      {/* Company card */}
      {companyContent && (
        <div className="animate-fade-in-up">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="px-6 pt-5 pb-6">
              <SectionLabel
                icon={<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>}
                label="Bedrijf"
                color="blue"
              />
              <div className="mt-4 card-prose">
                <ReactMarkdown>{companyContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Person cards */}
      {persons.map((person, i) => (
        <div key={person.name} className="animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${getAvatarColor(person.name)}`} />
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(person.name)} flex items-center justify-center shrink-0 shadow-sm`}>
                  <span className="text-white text-sm font-bold">{getInitials(person.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <SectionLabel
                    icon={<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                    label="Deelnemer"
                    color="green"
                  />
                  <div className="mt-3 card-prose">
                    <ReactMarkdown>{person.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Meeting prep */}
      {meetingContent && (
        <div className="animate-fade-in-up" style={{ animationDelay: `${(persons.length + 1) * 100}ms` }}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-violet-500 to-violet-600" />
            <div className="px-6 pt-5 pb-6">
              <SectionLabel
                icon={<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                label="Voorbereiding"
                color="purple"
              />
              <div className="mt-4 card-prose">
                <ReactMarkdown>{meetingContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streaming indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 pl-2 py-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-xs text-slate-400">Genereren...</span>
        </div>
      )}

      {/* Completion */}
      {isDone && (
        <div className="animate-fade-in-up text-center py-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Voorbereiding compleet
          </div>
        </div>
      )}
    </div>
  );
}
