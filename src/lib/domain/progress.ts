export function getDailyReduction(input: {
  baselinePerDay: number;
  smokedToday: number;
}): { fewerCigarettes: number; reductionRate: number } {
  const fewerCigarettes = Math.max(input.baselinePerDay - input.smokedToday, 0);
  const reductionRate =
    input.baselinePerDay === 0 ? 0 : fewerCigarettes / input.baselinePerDay;

  return { fewerCigarettes, reductionRate };
}

export function getMoneySaved(input: {
  baselinePerDay: number;
  smokedCount: number;
  daysSinceQuit: number;
  cigarettePricePerPack: number;
  cigarettesPerPack: number;
}): number {
  const expectedCount = input.baselinePerDay * input.daysSinceQuit;
  const fewerCount = Math.max(expectedCount - input.smokedCount, 0);

  const unitPrice = input.cigarettePricePerPack / input.cigarettesPerPack;
  const saved = fewerCount * unitPrice;
  return Math.round(saved);
}
