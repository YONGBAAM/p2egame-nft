import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity("User")
export class User {
  @PrimaryColumn()
  walletAddress: string;

  @OneToMany(() => Item, item => item.user)
  items: Item[];

  @Column("float")
  gold: number = 0.0;

  @Column()
  score: number = 0;
}
