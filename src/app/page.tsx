import { getGlommaData, type GlommaData, type Observation } from "@/lib/nve";

export const revalidate = 1800; // 30 minutt

const EVENT_DATE = new Date("2026-08-01T10:00:00+02:00");

function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo",
  });
}

function StatCard({
  label,
  obs,
  large,
}: {
  label: string;
  obs: Observation | null;
  large?: boolean;
}) {
  const value = obs?.value != null ? obs.value.toFixed(1) : "–";
  const unit = obs?.unit ?? "";

  return (
    <div className="flex flex-col items-center rounded-2xl bg-sky-900/60 px-6 py-6 text-center">
      <span className="text-sm font-medium uppercase tracking-widest text-sky-300">
        {label}
      </span>
      <span
        className={
          large
            ? "mt-2 text-7xl font-bold tabular-nums text-white"
            : "mt-2 text-4xl font-semibold tabular-nums text-white"
        }
      >
        {value}
      </span>
      <span className="mt-1 text-lg text-sky-400">{unit}</span>
    </div>
  );
}

async function DataSection() {
  let data: GlommaData | null = null;
  let error: string | null = null;

  try {
    data = await getGlommaData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Ukjent feil";
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-900/40 p-6 text-center text-red-300">
        Kunne ikke hente data: {error}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <StatCard label="Vanntemperatur" obs={data!.temperature} large />
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Vannføring" obs={data!.flow} />
        <StatCard label="Vannstand" obs={data!.level} />
      </div>
      <p className="text-center text-xs text-sky-500">
        Stasjon: Blaker, Glomma · Oppdatert{" "}
        {data!.fetchedAt ? formatTime(data!.fetchedAt) : "ukjent"}
      </p>
    </section>
  );
}

export default function Home() {
  const days = daysUntil(EVENT_DATE);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-8 px-4 py-12">
      {/* Header */}
      <header className="text-center">
        <div className="text-5xl">🏊</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Glommadyppen 2026
        </h1>
        <p className="mt-1 text-sky-300">Sørumsand → Fetsund · 1. august</p>
      </header>

      {/* Nedtelling */}
      <div className="flex flex-col items-center rounded-2xl bg-sky-800/50 px-6 py-6 text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-sky-300">
          Dager til arrangementet
        </span>
        <span className="mt-2 text-6xl font-bold tabular-nums">{days}</span>
        {days === 0 && (
          <span className="mt-2 text-lg font-semibold text-yellow-300">
            Det er i dag! Lykke til! 🎉
          </span>
        )}
      </div>

      {/* Vannforhold */}
      <section>
        <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-sky-400">
          Nåværende vannforhold
        </h2>
        <DataSection />
      </section>

      {/* Info */}
      <section className="rounded-2xl bg-sky-900/40 px-6 py-5 text-sm text-sky-200">
        <h2 className="mb-3 font-semibold text-white">Om arrangementet</h2>
        <ul className="space-y-2">
          <li>
            <span className="font-medium text-white">Dato:</span> 1. august
            2026
          </li>
          <li>
            <span className="font-medium text-white">Rute:</span> Sørumsand →
            Fetsund (med strømmen)
          </li>
          <li>
            <span className="font-medium text-white">Datakilde:</span>{" "}
            NVE – Norges vassdrags- og energidirektorat, målestasjon Blaker
          </li>
        </ul>
      </section>

      <footer className="text-center text-xs text-sky-600">
        Data oppdateres automatisk hvert 30. minutt
      </footer>
    </main>
  );
}
