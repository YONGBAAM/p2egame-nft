import { OneItemDto } from "./one-item-dto";

export class UpdateItemsDto {
  constructor(gold: number, items: OneItemDto[]) {
    this.gold = gold;
    this.items = items;
  };
  gold: number = 0;
  items: OneItemDto[] = [];
}