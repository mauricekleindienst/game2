import { GameItem, ItemHandler, createBaseItem } from './game-items';

export interface Ore extends GameItem {
  xp: number; 
  duration: number; 
}

const TABLE_NAME = 'ores';

const baseHandler = createBaseItem<Ore>(TABLE_NAME);

export const getAllOres = baseHandler.getAll;
export const getOreById = baseHandler.getById;

export const oreHandler: ItemHandler<Ore> = {
  getAll: getAllOres,
  getById: getOreById
}; 