import { GameItem, ItemHandler, createBaseItem } from './game-items';

export interface Wood extends GameItem {
  xp: number; 
  duration: number; 
}

const TABLE_NAME = 'wood';

const baseHandler = createBaseItem<Wood>(TABLE_NAME);

export const getAllWood = baseHandler.getAll;
export const getWoodById = baseHandler.getById;

export const woodHandler: ItemHandler<Wood> = {
  getAll: getAllWood,
  getById: getWoodById
}; 