export const ParticleTypes = {
  Empty: 0,
  Sand: 1,
  Water: 2,
  Stone: 3,
} as const;

export type ParticleType = typeof ParticleTypes[keyof typeof ParticleTypes];

// Color lookup by particle ID:
export const COLORS: Record<ParticleType, [number, number, number]> = {
  [ParticleTypes.Empty]: [0, 0, 0],
  [ParticleTypes.Sand]: [194, 178, 128],
  [ParticleTypes.Water]: [0, 100, 200],
  [ParticleTypes.Stone]: [128, 128, 128],
};