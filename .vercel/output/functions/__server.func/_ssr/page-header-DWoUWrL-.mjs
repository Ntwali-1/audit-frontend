import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./api-_p3LF9GJ.mjs";
function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-wrap items-end justify-between gap-4 pb-6", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label mb-2", children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h1",
        {
          className: "text-[24px] font-medium leading-tight tracking-tight",
          style: { color: "var(--brown-800)" },
          children: title
        }
      ),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 max-w-2xl text-[13px]", style: { color: "var(--text-muted)" }, children: description })
    ] }),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-2", children: actions })
  ] });
}
function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  trend
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group card-elevated overflow-hidden p-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            style: { background: "radial-gradient(closest-side, rgba(0,0,0,0.06), transparent)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": true,
            className: "absolute inset-y-0 right-0 w-[3px]",
            style: {
              background: "linear-gradient(180deg, transparent, var(--brown-800) 30%, var(--brown-800) 70%, transparent)",
              opacity: 0.85
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-2 text-[28px] font-semibold leading-none tracking-tight tabular-nums",
                style: { color: "var(--brown-800)" },
                children: value
              }
            ),
            hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[13px]", style: { color: "var(--text-muted)" }, children: hint }),
            trend && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                style: trend.positive ? { backgroundColor: "#ECFDF3", color: "#067647", border: "0.5px solid #ABEFC6" } : { backgroundColor: "#FEF3F2", color: "#B42318", border: "0.5px solid #FECDCA" },
                children: [
                  trend.positive ? "▲" : "▼",
                  " ",
                  trend.value
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105",
              style: { backgroundColor: "var(--brown-800)", color: "#FFFFFF" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 1.75 })
            }
          )
        ] })
      ]
    }
  );
}
export {
  PageHeader as P,
  StatTile as S
};
