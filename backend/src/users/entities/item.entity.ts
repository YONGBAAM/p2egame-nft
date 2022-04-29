import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Item {

  @PrimaryGeneratedColumn()
  iid: string;

  @Column()
  nftId: string;

  @Column()
  grade: number;

  @ManyToOne(() => User, user => user.items)
  user: User;
}