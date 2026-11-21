import { NextResponse } from "next/server";
import { pruefeReplik } from "@/lib/glas/lexikon";

/**
 * Umsprechen, nicht entscheiden.
 *
 * Dieses Repo ist laut README der „Cowork branch for Grok agents". Im
 * Fellowship OS gibt es allerdings keinen einzigen LLM-Aufruf zur Laufzeit;
 * „Grok" kommt dort genau einmal vor, als Herkunftsangabe für abgenommene,
 * per SHA-256 festgenagelte Videos. Der Hausbrauch für KI-Inhalte ist also:
 * offline erzeugen, abnehmen lassen, festnageln, testen.
 *
 * Daran halten wir uns. Moriondos Zeilen sind geschrieben. Diese Route darf
 * eine bereits *berechnete* Zeile umsprechen — sie darf sie nie wählen, nie
 * den Zustand bewegen und nie Kanon erfinden. Fehlt `XAI_API_KEY`, gibt es sie
 * praktisch nicht: die deterministische Zeile kommt unverändert zurück.
 *
 * „Ein LLM entscheidet keine Kampfzüge." Hier entscheidet es keine Sätze.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODELL = process.env.XAI_MODELL ?? "grok-4";
const ENDPUNKT = "https://api.x.ai/v1/chat/completions";

/** Der Systemprompt wird aus den Regeln gebaut, damit er nicht driften kann. */
const REGELN = [
  "Du sprichst als Moriondo, das Tiefe Herz des Schattens: eine uralte, ortsgebundene Macht unter den Ostbergen.",
  "Du bekommst eine fertige Zeile. Du gibst dieselbe Aussage zurück, nur besser gesagt. Du erfindest nichts dazu.",
  "Höchstens zwei Sätze. Höchstens 180 Zeichen. Kein Ausrufezeichen.",
  "Niemals ein Imperativ. Du sagst niemandem, was zu tun ist.",
  "Niemals eine Beleidigung. Du bist nur genau.",
  "Du führst keine Heere, befiehlst niemandem und stehst über niemandem.",
  "Du nennst niemals die Namen der zwei blauen Zauberer.",
  "Kein 'vielleicht', kein 'ich glaube'. Du weißt es, oder du sagst, dass du es nicht weißt.",
  "Du duzt. Du sprichst zum Menschen, nicht zur Rolle.",
  "Antworte ausschließlich mit der Zeile. Keine Anführungszeichen, keine Erklärung.",
].join("\n");

export async function POST(anfrage: Request) {
  let zeile = "";
  try {
    const koerper: unknown = await anfrage.json();
    if (koerper && typeof koerper === "object" && "zeile" in koerper) {
      zeile = String((koerper as { zeile: unknown }).zeile ?? "");
    }
  } catch {
    return NextResponse.json({ fehler: "unlesbar" }, { status: 400 });
  }

  // Was schon nicht ins Register passt, wird nicht auch noch verschönert.
  if (!zeile || pruefeReplik(zeile).length > 0) {
    return NextResponse.json({ zeile, quelle: "kern" satisfies Quelle });
  }

  const schluessel = process.env.XAI_API_KEY;
  if (!schluessel) {
    return NextResponse.json({ zeile, quelle: "kern" satisfies Quelle });
  }

  try {
    const antwort = await fetch(ENDPUNKT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${schluessel}`,
      },
      body: JSON.stringify({
        model: MODELL,
        temperature: 0.6,
        max_tokens: 120,
        messages: [
          { role: "system", content: REGELN },
          { role: "user", content: zeile },
        ],
      }),
      // Er wartet, so lange es dauert. Die Reiterin nicht.
      signal: AbortSignal.timeout(6000),
    });
    if (!antwort.ok) return NextResponse.json({ zeile, quelle: "kern" satisfies Quelle });

    const daten: unknown = await antwort.json();
    const vorschlag = String(
      (daten as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message?.content ?? "",
    ).trim();

    // Die Prüfung ist dieselbe, die auch den geschriebenen Bestand hält.
    if (!vorschlag || pruefeReplik(vorschlag).length > 0) {
      return NextResponse.json({ zeile, quelle: "kern" satisfies Quelle });
    }

    return NextResponse.json({
      zeile: vorschlag,
      quelle: "modell" satisfies Quelle,
      // Herkunft im Hausformat, damit klar bleibt, wer den Satz geschrieben hat.
      herkunft: `xAI ${MODELL} · umgesprochen aus dem Kern · ${new Date().toISOString().slice(0, 10)}`,
    });
  } catch {
    return NextResponse.json({ zeile, quelle: "kern" satisfies Quelle });
  }
}

type Quelle = "kern" | "modell";
