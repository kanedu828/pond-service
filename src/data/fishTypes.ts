export interface Fish {
  id: number;
  name: string;
  description: string;
  lengthRangeInCm: number[];
  expRewarded: number;
  rarity: string;
  secondsFishable: number;
}

export interface Pond {
  name: string;
  requiredLevel: number;
  fish: Fish[];
}

export interface FishCollection {
  pond: Pond;
}
