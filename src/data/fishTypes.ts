export interface Fish {
  id: number;
  name: string;
  description: string;
  lengthRangeInCm: number[];
  expRewarded: number;
  rarity: string;
  secondsFishable: number;
}

export interface FishData {
  common: Fish[];
  rare: Fish[];
  epic: Fish[];
  legendary: Fish[];
}
