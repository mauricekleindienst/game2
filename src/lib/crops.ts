import { GameItem, ItemHandler, createBaseItem } from './game-items';

export interface Crop extends GameItem {
  xp: number; 
  duration: number; 
}

const TABLE_NAME = 'farming_crops'; 

const baseHandler = createBaseItem<Crop>(TABLE_NAME);

export const getAllCrops = baseHandler.getAll;
export const getCropById = baseHandler.getById;

export const cropHandler: ItemHandler<Crop> = {
  getAll: getAllCrops,
  getById: getCropById
}; 