"use client";
import { useState, useCallback } from "react";

interface StreamState {
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  fullText: string;
  remaining: number | null;
  isDone: boolean;
}

export function useStreamingGeneration() {
  const [state, setState] = useState<StreamState>({
    isLoading: false,
    isSearching: false,
    error: null,
    fullText: "",
    remaining: null,
    isDone: false,
  });

  const generate = useCallback(
    async (company: string, persons: string[]) => {
      setState({
        isLoading: true,
        isSearching: true,
        error: null,
        fullText: "",
        remaining: null,
        isDone: false,
      });

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company, persons }),
        });

        if (!response.ok) {
          const data = await response.json();
          setState((s) => ({
            ...s,
            isLoading: false,
            isSearching: false,
            error: data.error || "Er ging iets mis.",
          }));
          return;
        }

        setState((s) => ({ ...s, isSearching: false }));

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Geen stream beschikbaar");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "meta") {
                setState((s) => ({ ...s, remaining: data.remaining }));
              } else if (data.type === "text") {
                setState((s) => ({
                  ...s,
                  fullText: s.fullText + data.content,
                }));
              } else if (data.type === "done") {
                setState((s) => ({ ...s, isLoading: false, isDone: true }));
              } else if (data.type === "error") {
                setState((s) => ({
                  ...s,
                  isLoading: false,
                  error: data.content,
                }));
              }
            } catch {
              // skip malformed JSON
            }
          }
        }

        setState((s) => ({ ...s, isLoading: false, isDone: true }));
      } catch {
        setState((s) => ({
          ...s,
          isLoading: false,
          isSearching: false,
          error: "Verbindingsfout. Probeer het opnieuw.",
        }));
      }
    },
    []
  );

  return { ...state, generate };
}
