import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./api-_p3LF9GJ.mjs";
function Spinner({ size = 16, invert, disabled, className, ...props }) {
  if (disabled) return null;
  const sizePx = `${size}px`;
  const barWidth = `${(size * 0.2).toFixed(2)}px`;
  const barHeight = `${(size * 0.075).toFixed(2)}px`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("relative inline-block", className),
      style: { width: sizePx, height: sizePx },
      ...props,
      children: [
        [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-1/2 top-1/2",
            style: {
              width: barWidth,
              height: barHeight,
              transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateY(-${size * 0.35}px)`,
              transformOrigin: "center",
              animation: `spinner-fade 1s linear infinite`,
              animationDelay: `${i * 0.2}s`,
              background: invert ? "var(--background)" : "var(--primary)",
              borderRadius: "9999px"
            }
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes spinner-fade { 0%, 100% { opacity: 0.15 } 40% { opacity: 1 } }` })
      ]
    }
  );
}
export {
  Spinner as S
};
