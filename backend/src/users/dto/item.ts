import { ArgumentOutOfRangeError } from "rxjs";
import {Attribute} from "./item-metadata"

export class Item {
  constructor(nft_id:number, attributes:Attribute[]) {

    this.nft_id = nft_id;
    if (!nft_id || (nft_id <=0)) {
      throw new Error("NFT id should be set and from 1")
    }
    this.attributes = attributes;
  }
  nft_id: number; 
  attributes:Attribute[];
  lot:number = 1;
}