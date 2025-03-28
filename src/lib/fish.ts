import { GameItem, ItemHandler, createBaseItem } from './game-items';
export interface Fish extends GameItem {
  min_actiontime: number; // Minimum time in seconds to catch this fish
  max_actiontime: number; // Maximum time in seconds to catch this fish
  xp: number; // Experience points gained from catching this fish
}
const TABLE_NAME = 'fish';
const baseHandler = createBaseItem<Fish>(TABLE_NAME);
export const getAllFish = baseHandler.getAll;
export const getFishById = baseHandler.getById;
export const fishHandler: ItemHandler<Fish> = {
  getAll: getAllFish,
  getById: getFishById
}; 