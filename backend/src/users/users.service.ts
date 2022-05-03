import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm"
import { User } from './entities/user.entity';
import { UpdateItemsDto } from './dto/update-items.dto';
import { Item } from './dto/item';
import { json } from 'express';
import { GameService, GANGHWA_COST } from './game.service';
import { OnChainService } from 'src/transactions/on-chain.service';


/*
Note: this is based on non-migrated versions.
Please Refactor
*/
// Service만 먼저 짜고, 컨트롤러에서 여러개 분기
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly onChainService:OnChainService
  ) {


   };

  // 여기서 jwt 리턴해주고, 게임 로그인시 밸리데이트
  async findUserOrCreate(walletAddress: string): Promise<User> {
    walletAddress = walletAddress.toLowerCase();
    var user = await this.userRepository.findOne({ walletAddress: walletAddress })
    if (user == undefined) {
      const newUser = new User();
      newUser.walletAddress = walletAddress;
      newUser.items = []
      newUser.withdrawed_score = -1000;
      await this.userRepository.save(newUser);
      return newUser;
    }
    return user;
  }

  async findUser(walletAddress: string): Promise<User> {
    return this.findUserOrCreate(walletAddress);
  }

  async saveUser(user:User) {
    return this.userRepository.save(user);
  }

  async getAllItems(walletAddress: string): Promise<UpdateItemsDto> {
    const user = await this.findUser(walletAddress);
    Logger.log(JSON.stringify(user))
    

    const returnItemsDto = new UpdateItemsDto(user.gold, user.items);
    return returnItemsDto;
  }

  async addAllItems(walletAddress: string, itemsDto: UpdateItemsDto) {
    const user = await this.findUser(walletAddress);
    if (!user.items) {
      user.items = [];
    }
    for (const itemDto of itemsDto.items) {  // in 은 인덱스, of가 'in'
      const idx = user.items.findIndex((e,i,a) => e.nft_id === itemDto.nft_id)
      if (idx === -1) {
        user.items.push(new Item(itemDto.nft_id, itemDto.attributes));
      }
      else {
        user.items[idx].lot +=1;
      }
    }
    user.gold = user.gold + itemsDto.gold;
    Logger.log(user.toString())
    this.userRepository.save(user)
  }

  async deleteAllItems(walletAddress: string, deleteItemsDto: UpdateItemsDto) {
    const user = await this.findUser(walletAddress);
    
    if (user.gold < deleteItemsDto.gold) {
      throw new MethodNotAllowedException("user does not have items");
    }
    user.gold = user.gold - deleteItemsDto.gold;

    for (const itemDto of deleteItemsDto.items) {  // in 은 인덱스, of가 'in'
      const idx = user.items.findIndex((e,i,a) => e.nft_id === itemDto.nft_id)
      if (idx === -1) {
        throw new Error("User Not have All Items: " + itemDto.nft_id)
      }
      else {
        user.items[idx].lot -=itemDto.lot;
      }
    }

    user.items = user.items.filter(item => item.lot>0)

    this.userRepository.save(user)
  }

  async findTopScoreUser(): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder("User").orderBy("score", "DESC").getOne();

    return user;
  }

 

  async useScore(walletAddress: string, amount:number){
    const user = await this.findUserOrCreate(walletAddress);
    user.withdrawed_score = user.withdrawed_score + amount;
    return this.saveUser(user)
  }

}
