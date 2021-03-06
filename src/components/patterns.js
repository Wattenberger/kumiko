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

import asaNoHa1 from "./patterns/named/asa-no-ha1.svg";
import asaNoHa2 from "./patterns/named/asa-no-ha2.svg";
import asaNoHa3 from "./patterns/named/asa-no-ha3.svg";
import asaNoHa4 from "./patterns/named/asa-no-ha4.svg";
import asaNoHa5 from "./patterns/named/asa-no-ha5.svg";
import kuruma1 from "./patterns/named/kuruma1.svg";
import kuruma2 from "./patterns/named/kuruma2.svg";
import kuruma3 from "./patterns/named/kuruma3.svg";
import misc1 from "./patterns/named/misc1.svg";
import misc2 from "./patterns/named/misc2.svg";
import misc3 from "./patterns/named/misc3.svg";
import misc4 from "./patterns/named/misc4.svg";
import misc5 from "./patterns/named/misc5.svg";
import misc6 from "./patterns/named/misc6.svg";
import misc7 from "./patterns/named/misc7.svg";
import rindo1 from "./patterns/named/rindo1.svg";
import rindo2 from "./patterns/named/rindo2.svg";
import rindo3 from "./patterns/named/rindo3.svg";
import sakura1 from "./patterns/named/sakura1.svg";
import sakura1b from "./patterns/named/sakura1b.svg";
import sakura2 from "./patterns/named/sakura2.svg";
import sakura3 from "./patterns/named/sakura3.svg";
import sakura4 from "./patterns/named/sakura4.svg";

const parseRawPatternString = (str) => {
  const viewBoxSplit = str
    .split("<svg ")[1]
    .split(/viewBox=\"([\d. ]){4,}\">/)[2];
  return viewBoxSplit
    ? viewBoxSplit
        .split("</svg>")[0]
        .split(`fill="none" stroke="#000" stroke-width=".72"`)
        .join("")
    : "";
};

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
  asaNoHa1,
  asaNoHa2,
  asaNoHa3,
  asaNoHa4,
  asaNoHa5,
  kuruma1,
  kuruma2,
  kuruma3,
  misc1,
  misc2,
  misc3,
  misc4,
  misc5,
  misc6,
  misc7,
  rindo1,
  rindo2,
  rindo3,
  sakura1,
  sakura1b,
  sakura2,
  sakura3,
  sakura4,
].map(parseRawPatternString);
