"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function MiniIdsDashboardPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [severity, setSeverity] = useState("all");

  useEffect(() => {
    fetch("/data/mini-ids-report.json")
      .then((res) => res.json())
      .then((data: Report) => setReport(data));
  }, []);

  const alerts = report?.alerts ?? [];

  const filteredAlerts = useMemo(() => {
    if (severity === "all") return alerts;
    return alerts.filter((alert) => alert.severity === severity);
  }, [alerts, severity]);

  const summary = {
    total: alerts.length,
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
    critical: alerts.filter((a) => a.risk_level === "critical").length,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-cyan-400">
            Cybersecurity Portfolio Demo
          </p>
          <h1 className="text-4xl font-bold mt-2">Mini Network IDS Dashboard</h1>
          <p className="text-slate-400 mt-3 max-w-3xl">
            Static Vercel demo based on exported IDS alert data. Shows PCAP-based
            detections, MITRE ATT&CK enrichment, threat scoring, and alert triage
            workflow.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Metric title="Total Alerts" value={summary.total} />
          <Metric title="High" value={summary.high} />
          <Metric title="Medium" value={summary.medium} />
          <Metric title="Low" value={summary.low} />
          <Metric title="Critical Risk" value={summary.critical} />
        </section>

        <section className="mb-6 flex gap-3 flex-wrap">
          {["all", "high", "medium", "low"].map((item) => (
            <button
              key={item}
              onClick={() => setSeverity(item)}
              className={`rounded-full px-4 py-2 text-sm border ${
                severity === item
                  ? "bg-cyan-400 text-slate-950 border-cyan-400"
                  : "bg-slate-900 border-slate-700 text-slate-200"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </section>

        <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="w-full text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="text-left p-4">Timestamp</th>
                <th className="text-left p-4">Severity</th>
                <th className="text-left p-4">Risk</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Alert</th>
                <th className="text-left p-4">Source</th>
                <th className="text-left p-4">Destination</th>
                <th className="text-left p-4">MITRE</th>
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((alert, index) => (
                <tr key={index} className="border-t border-slate-800">
                  <td className="p-4 text-slate-400">{alert.timestamp}</td>
                  <td className="p-4">
                    <Badge value={alert.severity} />
                  </td>
                  <td className="p-4">
                    <Badge value={alert.risk_level ?? "n/a"} />
                  </td>
                  <td className="p-4">{alert.threat_score ?? 0}</td>
                  <td className="p-4">
                    <div className="font-medium">
                      {alert.display_name || alert.alert_type}
                    </div>
                    <div className="text-slate-500">{alert.description}</div>
                  </td>
                  <td className="p-4">{alert.source_ip}</td>
                  <td className="p-4">{alert.destination_ip}</td>
                  <td className="p-4 text-cyan-400">
                    {alert.mitre_attack?.technique_id ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-500/15 text-red-300 border-red-500/30",
    medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    low: "bg-green-500/15 text-green-300 border-green-500/30",
    critical: "bg-red-600/25 text-red-200 border-red-500/40",
    "n/a": "bg-slate-700 text-slate-300 border-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
        styles[value] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {value}
    </span>
  );
}