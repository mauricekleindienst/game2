import { GameItem, ItemHandler, createBaseItem } from './game-items';
export interface Fish extends GameItem {
  min_actiontime: number; 
  max_actiontime: number; 
  xp: number; 
}
const TABLE_NAME = 'fish';
const baseHandler = createBaseItem<Fish>(TABLE_NAME);
export const getAllFish = baseHandler.getAll;
export const getFishById = baseHandler.getById;
export const fishHandler: ItemHandler<Fish> = {
  getAll: getAllFish,
  getById: getFishById
}; 