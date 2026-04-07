const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results: TavilyResult[];
}

export async function searchTavily(query: string): Promise<string> {
  if (!TAVILY_API_KEY) {
    return `[Geen real-time zoekresultaten beschikbaar. Gebruik je eigen kennis over dit bedrijf/deze persoon. Zoek in je trainingsdata naar informatie over LinkedIn profielen, bedrijfswebsites, nieuwsartikelen, etc. Wees eerlijk als je iets niet weet.]`;
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        max_results: 5,
        search_depth: "basic",
      }),
    });

    if (!response.ok) {
      return `[Zoekresultaten niet beschikbaar]`;
    }

    const data: TavilyResponse = await response.json();
    return data.results
      .map((r) => `${r.title}: ${r.content}`)
      .join("\n\n");
  } catch {
    return `[Zoekresultaten niet beschikbaar]`;
  }
}

export async function searchCompanyAndPersons(
  company: string,
  persons: string[]
): Promise<{ companyContext: string; personContexts: Record<string, string> }> {
  const searches = [
    searchTavily(`${company} bedrijf over ons sector medewerkers omzet diensten`),
    ...persons.map((p) =>
      searchTavily(`"${p}" ${company} LinkedIn functie achtergrond`)
    ),
  ];

  const results = await Promise.all(searches);

  const personContexts: Record<string, string> = {};
  persons.forEach((p, i) => {
    personContexts[p] = results[i + 1];
  });

  return {
    companyContext: results[0],
    personContexts,
  };
}
