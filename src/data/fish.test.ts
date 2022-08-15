import fishJson from './fish.json';

test('validate fish json data', () => {
  const fishSet = new Set();
  const validateFish = (element: any) => {
    if (!('id' in element)) {
      throw new Error(`A fish does not have an id`);
    }
    if (fishSet.has(element.id)) {
      throw new Error(`Fish id ${element.id} is a duplicate`);
    }
    if (!('name' in element)) {
      throw new Error(`Fish id ${element.id} does not have a name`);
    }
    if (!('description' in element)) {
      throw new Error(`Fish id ${element.id} does not have a description`);
    }
    if (!('lengthRangeInCm' in element)) {
      throw new Error(`Fish id ${element.id} does not have a lengthRangeInCm`);
    }
    if (!('secondsFishable' in element)) {
      throw new Error(`Fish id ${element.id} does not have a secondsFishable`);
    }
    if (!('expRewarded' in element)) {
      throw new Error(`Fish id ${element.id} does not have a expRewarded`);
    }
    if (!('rarity' in element)) {
      throw new Error(`Fish id ${element.id} does not have a rarirty`);
    }
    if (element.lengthRangeInCm.length !== 2) {
      throw new Error(
        `Fish id ${element.id} lengthRangeInCm array is not of length 2`
      );
    }
    if (
      element.rarity !== 'common' &&
      element.rarity !== 'rare' &&
      element.rarity !== 'epic' &&
      element.rarity !== 'legendary'
    ) {
      throw new Error(`Fish id ${element.id} does not have a valid rarity`);
    }

    fishSet.add(element.id);
  };
  fishJson.ponds.forEach((pond) => pond.fish.forEach(validateFish));
});
