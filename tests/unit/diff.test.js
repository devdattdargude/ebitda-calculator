import { diffObjects }
 from "../../src/utils/diff-engine.js";

const d =
 diffObjects({a:1},{a:2});

console.assert(d.a.after === 2);
