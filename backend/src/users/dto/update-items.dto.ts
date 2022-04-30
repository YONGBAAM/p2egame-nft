import { Item } from "./item";

export class UpdateItemsDto {
  constructor(gold: number, items: Item[]) {
    this.gold = gold;
    this.items = items;
  };
  gold: number = 0;
  items: Item[] = [];
}