"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type MitreAttack = {
  technique_id?: string;
  technique_name?: string;
  tactic?: string;
};

type Alert = {
  timestamp: string;
  alert_type: string;
  display_name?: string;
  severity: string;
  risk_level?: string;
  threat_score?: number;
  source_ip?: string;
  destination_ip?: string;
  description: string;
  mitre_attack?: MitreAttack | null;
  evidence?: Record<string, unknown>;
};

type Report = {
  summary?: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  alerts: Alert[];
};

type Incident = {
  incidentId: number;
  sourceIp: string;
  alertCount: number;
  totalScore: number;
  maxAlertScore: number;
  riskLevel: string;
  firstSeen: string;
  lastSeen: string;
  alertTypes: string[];
};

function getDisplayName(alert: Alert) {
  return alert.display_name || alert.alert_type;
}

function riskFromIncidentScore(score: number) {
  if (score >= 150) return "critical";
  if (score >= 90) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function buildIncidents(alerts: Alert[]): Incident[] {
  const groups = new Map<string, Alert[]>();

  for (const alert of alerts) {
    const sourceIp = alert.source_ip || "unknown";
    groups.set(sourceIp, [...(groups.get(sourceIp) || []), alert]);
  }

  return Array.from(groups.entries())
    .map(([sourceIp, sourceAlerts], index) => {
      const sorted = [...sourceAlerts].sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      );

      const totalScore = sorted.reduce(
        (sum, alert) => sum + (alert.threat_score || 0),
        0
      );

      const maxAlertScore = Math.max(
        ...sorted.map((alert) => alert.threat_score || 0),
        0
      );

      return {
        incidentId: index + 1,
        sourceIp,
        alertCount: sorted.length,
        totalScore,
        maxAlertScore,
        riskLevel: riskFromIncidentScore(totalScore),
        firstSeen: sorted[0]?.timestamp || "",
        lastSeen: sorted[sorted.length - 1]?.timestamp || "",
        alertTypes: Array.from(new Set(sorted.map(getDisplayName))).sort(),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

function countValues(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function topEntries(counter: Record<string, number>, limit = 5) {
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#e5e7eb",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#94a3b8",
        precision: 0,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.2)",
      },
    },
    y: {
      ticks: {
        color: "#94a3b8",
      },
      grid: {
        color: "rgba(148, 163, 184, 0.2)",
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#e5e7eb",
      },
    },
  },
};

export default function MiniIdsDashboardPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [ipQuery, setIpQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [alertType, setAlertType] = useState("all");

  useEffect(() => {
    fetch("/data/mini-ids-report.json")
      .then((response) => response.json())
      .then((data: Report) => setReport(data));
  }, []);

  const alerts = report?.alerts ?? [];

  const alertTypeOptions = useMemo(() => {
    return Array.from(new Set(alerts.map((alert) => alert.alert_type))).sort();
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesIp =
        !ipQuery ||
        alert.source_ip?.includes(ipQuery) ||
        alert.destination_ip?.includes(ipQuery);

      const matchesSeverity = severity === "all" || alert.severity === severity;

      const matchesRisk =
        riskLevel === "all" || (alert.risk_level || "n/a") === riskLevel;

      const matchesAlertType =
        alertType === "all" || alert.alert_type === alertType;

      return matchesIp && matchesSeverity && matchesRisk && matchesAlertType;
    });
  }, [alerts, ipQuery, severity, riskLevel, alertType]);

  const incidents = useMemo(
    () => buildIncidents(filteredAlerts),
    [filteredAlerts]
  );

  const allIncidents = useMemo(() => buildIncidents(alerts), [alerts]);

  const analytics = useMemo(() => {
    const severityCounts = countValues(filteredAlerts.map((a) => a.severity));

    const alertTypeCounts = countValues(filteredAlerts.map(getDisplayName));

    const mitreCounts = countValues(
      filteredAlerts
        .map((alert) =>
          alert.mitre_attack
            ? `${alert.mitre_attack.technique_id} — ${alert.mitre_attack.technique_name}`
            : ""
        )
        .filter(Boolean)
    );

    return {
      severityCounts,
      topAlertTypes: topEntries(alertTypeCounts),
      topMitre: topEntries(mitreCounts),
    };
  }, [filteredAlerts]);

  const summary = {
    total: alerts.length,
    shown: filteredAlerts.length,
    high: alerts.filter((alert) => alert.severity === "high").length,
    medium: alerts.filter((alert) => alert.severity === "medium").length,
    low: alerts.filter((alert) => alert.severity === "low").length,
    critical: alerts.filter((alert) => alert.risk_level === "critical").length,
    incidents: allIncidents.length,
  };

  const severityChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          analytics.severityCounts.high || 0,
          analytics.severityCounts.medium || 0,
          analytics.severityCounts.low || 0,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
        borderColor: "#111827",
        borderWidth: 2,
      },
    ],
  };

  const alertTypeChartData = {
    labels: analytics.topAlertTypes.map(([name]) => name),
    datasets: [
      {
        label: "Alerts",
        data: analytics.topAlertTypes.map(([, count]) => count),
        backgroundColor: "rgba(56, 189, 248, 0.65)",
        borderColor: "#38bdf8",
        borderWidth: 1,
      },
    ],
  };

  const mitreChartData = {
    labels: analytics.topMitre.map(([name]) => name),
    datasets: [
      {
        label: "Alerts",
        data: analytics.topMitre.map(([, count]) => count),
        backgroundColor: "rgba(129, 140, 248, 0.65)",
        borderColor: "#818cf8",
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
        <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Mini Network IDS Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-slate-400">
              Static Vercel demo based on exported IDS alert data. Shows
              PCAP-based detections, Sigma-style rules, MITRE ATT&CK enrichment,
              threat scoring, incident correlation, and SOC-style triage.
            </p>
          </div>

      <a
       href="https://github.com/5dalice/Mini-Network-IDS-MVP"
       target="_blank"
       rel="noopener noreferrer"
        className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400/20"
>
          🔍 View Source Code
            </a>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <MetricCard title="Total Alerts" value={summary.total} />
          <MetricCard title="Shown" value={summary.shown} />
          <MetricCard title="High Severity" value={summary.high} tone="high" />
          <MetricCard
            title="Medium Severity"
            value={summary.medium}
            tone="medium"
          />
          <MetricCard title="Low Severity" value={summary.low} tone="low" />
          <MetricCard title="Incidents" value={summary.incidents} />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.1fr_1.1fr]">
          <ChartCard title="Severity Distribution">
            <Doughnut data={severityChartData} options={doughnutOptions} />
          </ChartCard>

          <ChartCard title="Top Alert Types">
            <Bar
              data={alertTypeChartData}
              options={{
                ...chartOptions,
                indexAxis: "y" as const,
                plugins: { legend: { display: false } },
              }}
            />
          </ChartCard>

          <ChartCard title="Top MITRE Techniques">
            <Bar
              data={mitreChartData}
              options={{
                ...chartOptions,
                indexAxis: "y" as const,
                plugins: { legend: { display: false } },
              }}
            />
          </ChartCard>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnalyticsPanel title="Top Alert Types" rows={analytics.topAlertTypes} />
          <AnalyticsPanel
            title="Top MITRE ATT&CK Techniques"
            rows={analytics.topMitre}
          />
        </section>

        <section className="mb-5 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl shadow-black/20">
          <h2 className="mb-4 text-lg font-semibold">Filters</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <input
              value={ipQuery}
              onChange={(event) => setIpQuery(event.target.value)}
              placeholder="Search source or destination IP..."
              className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />

            <Select value={severity} onChange={setSeverity}>
              <option value="all">All severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>

            <Select value={alertType} onChange={setAlertType}>
              <option value="all">All alert types</option>
              {alertTypeOptions.map((type) => {
                const representative = alerts.find(
                  (alert) => alert.alert_type === type
                );

                return (
                  <option key={type} value={type}>
                    {representative
                      ? getDisplayName(representative)
                      : type}
                  </option>
                );
              })}
            </Select>

            <Select value={riskLevel} onChange={setRiskLevel}>
              <option value="all">All risk levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="n/a">N/A</option>
            </Select>

            <button
              onClick={() => {
                setIpQuery("");
                setSeverity("all");
                setRiskLevel("all");
                setAlertType("all");
              }}
              className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 hover:border-cyan-400 hover:text-cyan-300"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/20">
          <SectionHeader
            title="Top Correlated Incidents"
            subtitle={`${incidents.length} incidents`}
          />

          {incidents.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <TableHeader>Incident ID</TableHeader>
                  <TableHeader>Source IP</TableHeader>
                  <TableHeader>Risk</TableHeader>
                  <TableHeader>Total Score</TableHeader>
                  <TableHeader>Alerts</TableHeader>
                  <TableHeader>First Seen</TableHeader>
                  <TableHeader>Last Seen</TableHeader>
                  <TableHeader>Alert Types</TableHeader>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr
                    key={incident.incidentId}
                    className="border-t border-slate-700/80 hover:bg-cyan-400/5"
                  >
                    <TableCell>#{incident.incidentId}</TableCell>
                    <TableCell>{incident.sourceIp}</TableCell>
                    <TableCell>
                      <Badge value={incident.riskLevel} />
                    </TableCell>
                    <TableCell>{incident.totalScore}</TableCell>
                    <TableCell>{incident.alertCount}</TableCell>
                    <TableCell muted>{incident.firstSeen}</TableCell>
                    <TableCell muted>{incident.lastSeen}</TableCell>
                    <TableCell muted>
                      {incident.alertTypes.join(", ")}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState text="No correlated incidents found." />
          )}
        </section>

        <section className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/20">
          <SectionHeader
            title="Alerts"
            subtitle={`${filteredAlerts.length} rows shown`}
          />

          {filteredAlerts.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <TableHeader>Timestamp</TableHeader>
                  <TableHeader>Severity</TableHeader>
                  <TableHeader>Risk</TableHeader>
                  <TableHeader>Score</TableHeader>
                  <TableHeader>Alert Type</TableHeader>
                  <TableHeader>Source IP</TableHeader>
                  <TableHeader>Destination IP</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>MITRE</TableHeader>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert, index) => (
                  <tr
                    key={`${alert.timestamp}-${alert.alert_type}-${index}`}
                    className="border-t border-slate-700/80 hover:bg-cyan-400/5"
                  >
                    <TableCell muted>{alert.timestamp}</TableCell>
                    <TableCell>
                      <Badge value={alert.severity} />
                    </TableCell>
                    <TableCell>
                      <Badge value={alert.risk_level || "n/a"} />
                    </TableCell>
                    <TableCell>{alert.threat_score ?? 0}</TableCell>
                    <TableCell>{getDisplayName(alert)}</TableCell>
                    <TableCell>{alert.source_ip}</TableCell>
                    <TableCell>{alert.destination_ip}</TableCell>
                    <TableCell muted>{alert.description}</TableCell>
                    <TableCell accent>
                      {alert.mitre_attack?.technique_id || "—"}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState text="No alerts found for this filter." />
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone?: "high" | "medium" | "low";
}) {
  const toneClass =
    tone === "high"
      ? "text-red-400"
      : tone === "medium"
        ? "text-amber-400"
        : tone === "low"
          ? "text-green-400"
          : "text-slate-100";

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl shadow-black/20">
      <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl shadow-black/20">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="relative h-[290px]">{children}</div>
    </div>
  );
}

function AnalyticsPanel({
  title,
  rows,
}: {
  title: string;
  rows: [string, number][];
}) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl shadow-black/20">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {rows.length ? (
        <div className="space-y-3">
          {rows.map(([name, count]) => (
            <div
              key={name}
              className="flex items-center justify-between gap-4 border-b border-slate-700/70 pb-3 last:border-b-0"
            >
              <span className="text-sm text-slate-200">{name}</span>
              <span className="font-semibold text-cyan-300">{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="No data available." />
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
    >
      {children}
    </select>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/80 px-5 py-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <span className="text-sm text-slate-400">{subtitle}</span>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs uppercase tracking-widest">
      {children}
    </th>
  );
}

function TableCell({
  children,
  muted = false,
  accent = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <td
      className={`px-4 py-4 ${
        accent ? "font-semibold text-cyan-300" : muted ? "text-slate-400" : ""
      }`}
    >
      {children}
    </td>
  );
}

function Badge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    high: "border-red-500/30 bg-red-500/15 text-red-300",
    medium: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    low: "border-green-500/30 bg-green-500/15 text-green-300",
    critical: "border-red-500/40 bg-red-600/25 text-red-200",
    "n/a": "border-slate-600 bg-slate-700 text-slate-300",
  };

  return (
    <span
      className={`inline-flex min-w-[72px] justify-center rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
        styles[value] || "border-slate-600 bg-slate-700 text-slate-300"
      }`}
    >
      {value}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="p-6 text-center text-sm text-slate-500">{text}</div>;
}