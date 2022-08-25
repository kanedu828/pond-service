export interface Fish {
  id: number;
  name: string;
  description: string;
  lengthRangeInCm: number[];
  expRewarded: number;
  rarity: string;
  secondsFishable: number;
  pond: string;
}

export interface Pond {
  name: string;
  requiredLevel: number;
}