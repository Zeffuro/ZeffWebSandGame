export const ParticleState = {
  Solid: 0,   // Doesn't spread horizontally
  Liquid: 1,  // Spreads horizontally
  Gas: 2,     // Spreads horizontally and rises
  Static: 3   // Does not move at all
} as const;

export const ParticleTypes = {
  Empty: 0,
  Stone: 1,
  Sand: 2,
  Water: 3,
  Salt: 4,
  Plant: 5,
  Oil: 6,
  Fire: 7,
  Ash: 8,
  Smoke: 9,
} as const;

export type ParticleType = typeof ParticleTypes[keyof typeof ParticleTypes];
export type StateType = typeof ParticleState[keyof typeof ParticleState];

export const COLORS: Record<ParticleType, [number, number, number]> = {
  [ParticleTypes.Empty]: [0, 0, 0],
  [ParticleTypes.Stone]: [159, 159, 159],
  [ParticleTypes.Sand]: [232, 217, 179],
  [ParticleTypes.Water]: [0, 100, 200],
  [ParticleTypes.Salt]: [240, 240, 240],
  [ParticleTypes.Plant]: [34, 139, 34],
  [ParticleTypes.Oil]: [50, 40, 30],
  [ParticleTypes.Fire]: [255, 99, 71],
  [ParticleTypes.Ash]: [40, 40, 40],
  [ParticleTypes.Smoke]: [80, 80, 80],
};

export const DENSITIES: Record<ParticleType, number> = {
  [ParticleTypes.Empty]: 0,
  [ParticleTypes.Stone]: 2.4,
  [ParticleTypes.Sand]: 2.65,
  [ParticleTypes.Water]: 1.0,
  [ParticleTypes.Salt]: 2.16,
  [ParticleTypes.Plant]: 0.5,
  [ParticleTypes.Oil]: 0.85,
  [ParticleTypes.Fire]: -0.5,
  [ParticleTypes.Ash]: 2.5,
  [ParticleTypes.Smoke]: -0.2,
};

export const STATES: Record<ParticleType, StateType> = {
  [ParticleTypes.Empty]: ParticleState.Gas,
  [ParticleTypes.Stone]: ParticleState.Static,
  [ParticleTypes.Sand]: ParticleState.Solid,
  [ParticleTypes.Water]: ParticleState.Liquid,
  [ParticleTypes.Salt]: ParticleState.Solid,
  [ParticleTypes.Plant]: ParticleState.Static,
  [ParticleTypes.Oil]: ParticleState.Liquid,
  [ParticleTypes.Fire]: ParticleState.Gas,  
  [ParticleTypes.Ash]: ParticleState.Solid,
  [ParticleTypes.Smoke]: ParticleState.Gas,
};