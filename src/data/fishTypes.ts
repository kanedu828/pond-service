export interface Fish {
  id: number;
  name: string;
  description: string;
  lengthRangeInCm: number[];
  expRewarded: number;
  rarity: string;
}

export interface FishData {
  common: Fish[];
  rare: Fish[];
  epic: Fish[];
  legendary: Fish[];
}
