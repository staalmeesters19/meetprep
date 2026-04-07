import Anthropic from "@anthropic-ai/sdk";
import { searchCompanyAndPersons } from "@/lib/tavily";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "Daglimiet bereikt. Probeer het morgen opnieuw.",
        remaining: 0,
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Parse request
  const { company, persons } = await req.json();

  if (!company || !persons?.length) {
    return new Response(
      JSON.stringify({ error: "Bedrijfsnaam en minstens één naam zijn vereist." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Search for context
  const { companyContext, personContexts } = await searchCompanyAndPersons(
    company,
    persons
  );

  // Build prompt
  const userPrompt = buildUserPrompt(
    company,
    persons,
    companyContext,
    personContexts
  );

  // Stream from Claude
  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Create a readable stream for the response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      // Send remaining count as first chunk
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "meta", remaining })}\n\n`)
      );

      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "text", content: event.delta.text })}\n\n`
              )
            );
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", content: "Er ging iets mis bij het genereren." })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
