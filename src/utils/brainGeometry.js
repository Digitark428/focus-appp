import { BRAIN_CYCLE_COLORS, BRAIN_CYCLE_DAYS, BRAIN_NODES_PER_CYCLE } from "../constants/brain";

// Pseudo-random generator (deterministic by seed).
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// Anchor points (in viewBox 0..200) for each cluster in the upper skull region.
// 12 anchors, one per cycle, cycling around if a user reaches >12 cycles.
const CLUSTER_ANCHORS = [
  { x: 100, y: 50 }, // 1: top crown center
  { x: 75, y: 55 },  // 2: top left
  { x: 125, y: 55 }, // 3: top right
  { x: 60, y: 70 },  // 4: mid left
  { x: 140, y: 70 }, // 5: mid right
  { x: 100, y: 65 }, // 6: center
  { x: 70, y: 80 },  // 7: lower left
  { x: 130, y: 80 }, // 8: lower right
  { x: 100, y: 80 }, // 9: lower center
  { x: 85, y: 45 },  // 10: top inner left
  { x: 115, y: 45 }, // 11: top inner right
  { x: 100, y: 75 }, // 12: deep center
];

// Generate all nodes + links for a given total days count, distributed across cycles.
// Each cycle = up to ~70 nodes in a distinct cluster region of the brain shape.
export const generateBrainGeometry = (totalDays) => {
  if (totalDays === 0) return { nodes: [], links: [] };

  const nodes = []; // { x, y, cycleIdx, dayIdx, color, size, twinkleDelay }
  const links = []; // { from, to, cycleIdx, color, isBridge? }

  const totalCycles = Math.ceil(totalDays / BRAIN_CYCLE_DAYS);

  for (let cIdx = 0; cIdx < totalCycles; cIdx++) {
    const rng = seededRandom(cIdx * 7919 + 13);
    const color = BRAIN_CYCLE_COLORS[cIdx % BRAIN_CYCLE_COLORS.length];
    const anchor = CLUSTER_ANCHORS[cIdx % CLUSTER_ANCHORS.length];

    const cycleStartDay = cIdx * BRAIN_CYCLE_DAYS;
    const cycleEndDay = Math.min((cIdx + 1) * BRAIN_CYCLE_DAYS, totalDays);
    const daysInThisCycle = cycleEndDay - cycleStartDay;
    if (daysInThisCycle <= 0) continue;

    const nodesInThisCycle = Math.floor((daysInThisCycle / BRAIN_CYCLE_DAYS) * BRAIN_NODES_PER_CYCLE);
    const cycleNodeStartIdx = nodes.length;

    for (let n = 0; n < nodesInThisCycle; n++) {
      // Spread nodes around the cluster anchor.
      const angle = rng() * Math.PI * 2;
      const radius = 6 + rng() * 16;
      const x = anchor.x + Math.cos(angle) * radius;
      const y = anchor.y + Math.sin(angle) * radius;
      // Strict clamp to upper skull region.
      const cx = Math.max(52, Math.min(148, x));
      const cy = Math.max(38, Math.min(88, y));
      nodes.push({
        x: cx,
        y: cy,
        cycleIdx: cIdx,
        dayIdx: cycleStartDay + Math.floor(n / (BRAIN_NODES_PER_CYCLE / BRAIN_CYCLE_DAYS)),
        color,
        size: 1.2 + rng() * 1.6,
        twinkleDelay: rng() * 4,
      });
    }

    // Each new node links to 1-2 of the nearest existing nodes in this cycle.
    for (let n = 1; n < nodesInThisCycle; n++) {
      const fromIdx = cycleNodeStartIdx + n;
      const linksCount = 1 + Math.floor(rng() * 2);
      const candidates = [];
      for (let m = 0; m < n; m++) {
        const otherIdx = cycleNodeStartIdx + m;
        const dx = nodes[fromIdx].x - nodes[otherIdx].x;
        const dy = nodes[fromIdx].y - nodes[otherIdx].y;
        candidates.push({ idx: otherIdx, dist: Math.sqrt(dx * dx + dy * dy) });
      }
      candidates.sort((a, b) => a.dist - b.dist);
      for (let l = 0; l < Math.min(linksCount, candidates.length); l++) {
        links.push({ from: fromIdx, to: candidates[l].idx, cycleIdx: cIdx, color });
      }
    }

    // After cycle 1, add 1-2 inter-cycle bridges to the previous cycle's cluster.
    if (cIdx > 0 && cycleNodeStartIdx > 0 && nodesInThisCycle > 5) {
      const prevCycleNodes = nodes.slice(0, cycleNodeStartIdx).filter((n) => n.cycleIdx === cIdx - 1);
      if (prevCycleNodes.length > 0) {
        const bridgeCount = 1 + Math.floor(rng() * 2);
        for (let b = 0; b < bridgeCount; b++) {
          const fromIdx = cycleNodeStartIdx + Math.floor(rng() * Math.min(5, nodesInThisCycle));
          const prevNode = prevCycleNodes[Math.floor(rng() * prevCycleNodes.length)];
          const toIdx = nodes.indexOf(prevNode);
          if (toIdx !== -1) {
            links.push({ from: fromIdx, to: toIdx, cycleIdx: cIdx, color, isBridge: true });
          }
        }
      }
    }
  }

  return { nodes, links };
};
