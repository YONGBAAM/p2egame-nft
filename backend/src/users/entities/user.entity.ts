import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Item } from "../dto/item";

@Entity("User")
export class User {
  @PrimaryColumn()
  walletAddress: string;

  @Column("jsonb", {nullable:true})
  items: Item[];

  @Column("float")
  gold: number = 0.0;

  @Column()
  score: number = 0;
}
