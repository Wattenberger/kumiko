import patternA from "./patterns/a.svg";
import patternB from "./patterns/b.svg";
import patternC from "./patterns/c.svg";
import patternD from "./patterns/d.svg";
import patternE from "./patterns/e.svg";
import patternF from "./patterns/f.svg";
import patternG from "./patterns/g.svg";
import patternH from "./patterns/h.svg";
import patternI from "./patterns/i.svg";
import patternJ from "./patterns/j.svg";
import patternK from "./patterns/k.svg";
import patternL from "./patterns/l.svg";
import patternM from "./patterns/m.svg";
import patternN from "./patterns/n.svg";
import patternO from "./patterns/o.svg";
import patternP from "./patterns/p.svg";
import patternQ from "./patterns/q.svg";
import patternR from "./patterns/r.svg";
import patternS from "./patterns/s.svg";
import patternT from "./patterns/t.svg";
import patternU from "./patterns/u.svg";
import patternV from "./patterns/v.svg";
import patternW from "./patterns/w.svg";
import patternX from "./patterns/x.svg";
import patternY from "./patterns/y.svg";

const parseRawPatternString = (str) =>
  str
    .split("<svg ")[1]
    .split("</title>")[1]
    .split("</svg>")[0]
    .split(`fill="none" stroke="#000000" stroke-width="0.72"`)
    .join("");

export default [
  patternA,
  patternB,
  patternC,
  patternD,
  patternE, // empty
  patternF,
  patternI,
  patternJ,
  patternK, // blank
  patternM,
  patternN,
  patternO,
  patternP,
  // patternG,
  patternH,
  patternL,
  patternQ,
  patternR,
  patternS,
  patternT,
  patternU,
  patternV,
  patternW,
  patternX,
  // patternY,
].map(parseRawPatternString);
