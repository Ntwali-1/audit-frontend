/**
 * Shared chart vocabulary.
 *
 * Every admin surface draws from the same small set of forms and the same
 * --viz-* tokens, so two management screens never disagree about what a colour
 * or a bar means. The rules encoded here:
 *
 *   · ink carries magnitude — hue is spent only where lightness cannot do the
 *     job (two series to tell apart, or severity);
 *   · ordered categories use the neutral ordinal ramp, nominal ones get a
 *     single colour and let bar length carry the value;
 *   · severity wears the reserved status palette and never stands in for a
 *     series, always beside a visible label;
 *   · every bar is direct-labelled, so no value is reachable only by hovering.
 */
import * as React from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";

export const SERIES_1 = "var(--viz-series-1)";
export const SERIES_2 = "var(--viz-series-2)";
export const ORDINAL = Array.from({ length: 8 }, (_, i) => `var(--viz-ordinal-${i + 1})`);
export const INK = "var(--viz-ordinal-1)";
export const GRID = "var(--viz-grid)";
export const AXIS = "var(--viz-axis)";

export const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "var(--viz-critical)",
  HIGH: "var(--viz-serious)",
  MEDIUM: "var(--viz-warning)",
  LOW: "var(--viz-good)",
};

export const AXIS_TICK = { fontSize: 11, fill: AXIS };
export const nf = new Intl.NumberFormat();

/**
 * Spreads `count` ordered categories across the whole ramp instead of taking
 * the first N steps, so a six-stage pipeline never lands two neighbouring
 * stages on the same tone.
 */
export function ordinalScale(count: number) {
  if (count <= 1) return [ORDINAL[0]];
  return Array.from({ length: count }, (_, i) =>
    ORDINAL[Math.round((i * (ORDINAL.length - 1)) / (count - 1))],
  );
}

/** Counts occurrences, skipping rows the picker returns nothing for. */
export function tally<T>(rows: T[], pick: (row: T) => string | null | undefined) {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const key = pick(row);
    if (key) out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

/** Turns a count map into ordered, ramp-coloured bars. */
export function orderedBars(
  counts: Record<string, number>,
  order: string[],
  label: (key: string) => string,
): BarRow[] {
  const present = order.filter((k) => counts[k]);
  const scale = ordinalScale(present.length);
  return present.map((k, i) => ({ label: label(k), value: counts[k], color: scale[i] }));
}

/* -------------------------------------------------------------------------- */
/* Chrome                                                                     */
/* -------------------------------------------------------------------------- */

export function Panel({
  title, subtitle, className = "", action, children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border bg-white p-5 ${className}`}
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Nothing to plot yet — said once, quietly, instead of an axis with no marks. */
export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-[180px] items-center justify-center rounded-xl border border-dashed px-6 text-center text-[12px]"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
    >
      {children}
    </div>
  );
}

export function VizTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border bg-white px-3 py-2 text-[12px]"
      style={{ borderColor: "var(--border-default)", boxShadow: "var(--shadow-card-hover)" }}
    >
      <div className="mb-1 font-medium" style={{ color: "var(--brown-800)" }}>
        {payload[0]?.payload?.fullLabel ?? label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 tabular-nums">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: p.payload?.color ?? p.color ?? p.stroke ?? p.fill }}
          />
          <span style={{ color: "var(--text-muted)" }}>{p.name}</span>
          <span className="ml-auto font-medium" style={{ color: "var(--brown-800)" }}>
            {nf.format(p.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Legend chip. Identity is never colour alone — the swatch sits beside the
 * series name, and the endpoint value is direct-labelled here so the latest
 * reading is available without hovering.
 */
export function LegendChip({ color, label, value }: { color: string; label: string; value?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
      {value != null && (
        <span className="font-medium tabular-nums" style={{ color: "var(--brown-800)" }}>
          {nf.format(value)}
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Forms                                                                      */
/* -------------------------------------------------------------------------- */

export type FlowPoint = { label: string; fullLabel: string; opened: number; closed: number };
export type BarRow = { label: string; value: number; color: string; fullLabel?: string };

/** Two comparable series over time. One y-axis — never two. */
export function FlowChart({
  data, openedName, closedName,
}: { data: FlowPoint[]; openedName: string; closedName: string }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} strokeWidth={1} vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: GRID }} interval="preserveStartEnd" />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
        <RTooltip content={<VizTooltip />} cursor={{ stroke: AXIS, strokeWidth: 1 }} />
        <Line
          type="monotone" dataKey="opened" name={openedName} stroke={SERIES_1} strokeWidth={2}
          dot={{ r: 0 }} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--viz-surface)" }}
        />
        <Line
          type="monotone" dataKey="closed" name={closedName} stroke={SERIES_2} strokeWidth={2}
          dot={{ r: 0 }} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--viz-surface)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Horizontal bars, direct-labelled — every value readable without hovering. */
export function RankedBars({ data, height }: { data: BarRow[]; height?: number }) {
  /* A one-bar bar chart says nothing an axis-free statement doesn't. */
  if (data.length === 1) return <SoleCategory row={data[0]} />;

  return (
    <ResponsiveContainer width="100%" height={height ?? data.length * 34 + 24}>
      {/* No gridlines: the x-axis is hidden, so rules would be noise with
          nothing to read them against. Every bar is direct-labelled instead. */}
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, bottom: 0, left: 0 }} barCategoryGap={8}>
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category" dataKey="label" width={132}
          tick={{ fontSize: 12, fill: "var(--text-muted)" }} tickLine={false} axisLine={false}
        />
        <RTooltip content={<VizTooltip />} cursor={{ fill: "var(--brown-50)" }} />
        <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={14} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.color} />
          ))}
          <LabelList dataKey="value" position="right" offset={8} fontSize={11} fontWeight={600} fill="var(--brown-800)" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Everything is sitting in one bucket, so the number is the chart. Shown
 * whenever a breakdown collapses to a single category — common early on, when
 * every audit is still a draft.
 */
export function SoleCategory({ row }: { row: BarRow }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)" }}>
      <span aria-hidden className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
      <div className="min-w-0">
        <div className="text-[24px] font-semibold leading-none" style={{ color: "var(--brown-800)" }}>
          {nf.format(row.value)}
        </div>
        <div className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
          all of them at <span style={{ color: "var(--brown-600)" }}>{row.label}</span> — nothing else to compare yet
        </div>
      </div>
    </div>
  );
}

/** Vertical columns for short ordered or nominal sets. */
export function ColumnChart({ data, height = 200 }: { data: BarRow[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 16, right: 4, bottom: 0, left: -24 }} barCategoryGap={10}>
        <CartesianGrid stroke={GRID} strokeWidth={1} vertical={false} />
        <XAxis
          dataKey="label" tick={{ fontSize: 11, fill: AXIS }} tickLine={false}
          axisLine={{ stroke: GRID }} interval={0}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
        <RTooltip content={<VizTooltip />} cursor={{ fill: "var(--brown-50)" }} />
        <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.color} />
          ))}
          <LabelList dataKey="value" position="top" offset={6} fontSize={11} fontWeight={600} fill="var(--brown-800)" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** A ranked leaderboard reads better than an axis for a handful of names. */
export function MeterList({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="truncate" style={{ color: "var(--brown-600)" }}>{r.label}</span>
            <span className="shrink-0 font-medium tabular-nums" style={{ color: "var(--brown-800)" }}>
              {nf.format(r.value)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(r.value / max) * 100}%`, backgroundColor: INK }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A compact labelled number, for facts that do not deserve an axis. */
export function Kpi({
  label, value, hint, icon: Icon, tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ComponentType<any>;
  tone?: "critical" | "good";
}) {
  const toneColor =
    tone === "critical" ? "var(--viz-critical)" : tone === "good" ? "#067647" : undefined;

  return (
    <div
      className="rounded-2xl border bg-white p-4"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} style={{ color: "var(--text-hint)" }} />
        <span className="data-label">{label}</span>
      </div>
      <div
        className="mt-2 text-[26px] font-semibold leading-none tracking-tight"
        style={{ color: toneColor ?? "var(--brown-800)" }}
      >
        {value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export function FactRow({
  icon: Icon, label, value,
}: { icon: React.ComponentType<any>; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
      >
        <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
      </span>
      <dt className="min-w-0 flex-1 truncate text-[13px]" style={{ color: "var(--text-muted)" }}>
        {label}
      </dt>
      <dd className="text-[16px] font-semibold tabular-nums" style={{ color: "var(--brown-800)" }}>
        {typeof value === "number" ? nf.format(value) : value}
      </dd>
    </div>
  );
}
