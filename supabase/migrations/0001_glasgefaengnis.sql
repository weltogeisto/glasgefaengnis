-- Das Glasgefängnis — Sitzungen und Antworten.
--
-- Muster aus 0049_schattenkrieg.sql / 0089_ringschau_challenge.sql im
-- Fellowship OS: RLS an, öffentlich nur SELECT, alle Schreibvorgänge über den
-- Service-Role-Schlüssel, append-only, Idempotenzschlüssel gegen Doppelzüge.
--
-- Eine Abweichung, und die ist Absicht: Was jemand auf Moriondos Gegenfrage
-- geantwortet hat, steht hier NICHT. Das war der Preis, und der gehört dem, der
-- ihn bezahlt hat. Eine Tabelle mit „public read" ist der falsche Ort für ein
-- Geständnis, das jemand laut in einen Raum gesagt hat. Gespeichert wird, was
-- geteilt werden soll: die Antwort auf die letzte Frage, die über Jan.
--
-- Ohne gesetzte Umgebungsvariablen wird diese Migration nie ausgeführt, und die
-- App läuft vollständig aus localStorage weiter.

create table if not exists public.glas_sitzungen (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  gruppensaat text not null,
  frage_id text not null,
  -- Die Antwort auf „Wird er glücklich sein?". Der einzige Text hier drin,
  -- der für andere Augen bestimmt ist.
  letzte_antwort text not null check (char_length(letzte_antwort) between 3 and 400),
  riss boolean not null default false,
  -- Verhindert, dass ein hakendes Netz dieselbe Sitzung zweimal anlegt.
  idempotenz_schluessel text not null,
  created_at timestamptz not null default now(),
  unique (gruppensaat, slug),
  unique (idempotenz_schluessel)
);

comment on table public.glas_sitzungen is
  'Eine Zeile je geführtem Verhör. Der Preis (Antwort auf die Gegenfrage) wird bewusst nicht gespeichert.';

-- Das Zugprotokoll. Die einzige Wahrheit — der Zustand wird daraus
-- nachgerechnet, nie als fertiger Schnappschuss geglaubt. Gleiche Lehre wie
-- war_days und battle_moves.
create table if not exists public.glas_zuege (
  id bigint generated always as identity primary key,
  sitzung_id uuid not null references public.glas_sitzungen (id) on delete cascade,
  zug_nr integer not null check (zug_nr >= 0),
  art text not null check (art in ('frage', 'preis', 'letzte-antwort', 'gehen')),
  -- Absichtlich ohne Nutztext: 'preis' und 'letzte-antwort' werden hier nur
  -- als Ereignis vermerkt, nicht im Wortlaut.
  created_at timestamptz not null default now(),
  unique (sitzung_id, zug_nr)
);

alter table public.glas_sitzungen enable row level security;
alter table public.glas_zuege enable row level security;

-- Öffentlich lesbar, damit das Protokoll auf jedem Gerät dasselbe zeigt.
-- Geschrieben wird ausschließlich über den Service-Role-Schlüssel: es gibt
-- absichtlich keine INSERT-, UPDATE- oder DELETE-Policy.
drop policy if exists "glas_sitzungen: public read" on public.glas_sitzungen;
create policy "glas_sitzungen: public read"
  on public.glas_sitzungen for select
  using (true);

drop policy if exists "glas_zuege: public read" on public.glas_zuege;
create policy "glas_zuege: public read"
  on public.glas_zuege for select
  using (true);

revoke all on public.glas_sitzungen from anon, authenticated;
revoke all on public.glas_zuege from anon, authenticated;
grant select on public.glas_sitzungen to anon, authenticated;
grant select on public.glas_zuege to anon, authenticated;

create index if not exists glas_sitzungen_gruppensaat_idx
  on public.glas_sitzungen (gruppensaat, created_at desc);
