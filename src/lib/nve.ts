const NVE_BASE = "https://hydapi.nve.no/api/v1";
const STATION_ID = "2.17.0"; // Blaker, Glomma
const PARAMETERS = "1000,1001,1003"; // vannstand, vannføring, vanntemperatur

export interface Observation {
  parameter: number;
  parameterName: string;
  unit: string;
  value: number | null;
  time: string | null;
}

export interface GlommaData {
  temperature: Observation | null;
  flow: Observation | null;
  level: Observation | null;
  fetchedAt: string;
}

interface NveSeries {
  parameter: number;
  parameterName: string;
  unit: string;
  observations: { time: string; value: number }[];
}

export async function getGlommaData(): Promise<GlommaData> {
  const apiKey = process.env.NVE_API_KEY;
  if (!apiKey) throw new Error("NVE_API_KEY er ikke satt");

  const url = `${NVE_BASE}/Observations?StationId=${STATION_ID}&Parameter=${PARAMETERS}&ResolutionTime=0`;

  const res = await fetch(url, {
    headers: { "X-API-Key": apiKey, Accept: "application/json" },
    next: { revalidate: 1800 },
  });

  if (!res.ok) throw new Error(`NVE API feil: ${res.status}`);

  const json = await res.json();
  const series: NveSeries[] = json.data ?? [];

  const toObs = (paramId: number): Observation | null => {
    const s = series.find((x) => x.parameter === paramId);
    if (!s) return null;
    const latest = s.observations[0] ?? null;
    return {
      parameter: s.parameter,
      parameterName: s.parameterName,
      unit: s.unit,
      value: latest?.value ?? null,
      time: latest?.time ?? null,
    };
  };

  return {
    temperature: toObs(1003),
    flow: toObs(1001),
    level: toObs(1000),
    fetchedAt: new Date().toISOString(),
  };
}
