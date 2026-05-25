import { optimizeApplication } from "./packages/algorithms/src/index.ts";

const mockScholarships = [
  { id: "55555555-5555-5555-5555-555555555555", name: "DOST", estimatedEffortHours: 15, estimatedTotalValuePhp: 40000 },
  { id: "66666666-6666-6666-6666-666666666666", name: "Ayala", estimatedEffortHours: 10, estimatedTotalValuePhp: 50000 },
  { id: "77777777-7777-7777-7777-777777777777", name: "Alumni", estimatedEffortHours: 5, estimatedTotalValuePhp: 30000 },
  { id: "88888888-8888-8888-8888-888888888888", name: "CHED", estimatedEffortHours: 20, estimatedTotalValuePhp: 60000 }
];

const res = optimizeApplication({ availableHours: 20 } as any, mockScholarships as any);
console.log("Knapsack returned:", res.map((r: any) => r.name));
