import { Item } from "./item";

export class ItemMetadata {
  name: string;
  description: string;
  fee_recipient: string;
  seller_fee_basis_points: number;
  image: string;
  external_url: string;
  attributes: Attribute[];
  hash: string;

  getAttribute(key: string): string | null {
    return rawGetAttribute(this.attributes, key);
  }
}

export function rawGetAttribute(attributes: Attribute[], key: string): string | null {
  for (const at of attributes) {
    if (at.trait_type === key) {
      return at.value;
    }
  }
  return null;
}

export class Attribute {
  trait_type: string;
  value: string;
}