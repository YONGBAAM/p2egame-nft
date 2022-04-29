import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm"
import { User } from './entities/user.entity';
import { Item } from './entities/item.entity';
import { UpdateItemsDto as ItemsDto, UpdateItemsDto } from './dto/update-items.dto';
import { OneItemDto } from './dto/one-item-dto';
import { Transaction } from 'src/transactions/entities/transaction.entity';

// Service만 먼저 짜고, 컨트롤러에서 여러개 분기

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Item) private itemRepository: Repository<Item>
  ) { };

  // 여기서 jwt 리턴해주고, 게임 로그인시 밸리데이트
  async findUserOrCreate(walletAddress: string): Promise<User> {
    var user = await this.userRepository.findOneBy({ walletAddress: walletAddress })
    if (user == undefined) {
      const newUser = new User();
      newUser.walletAddress = walletAddress;
      newUser.items = []
      await this.userRepository.save(newUser);
      return newUser;
    }
    return user;
  }

  async findUser(walletAddress: string): Promise<User> {
    const user = this.userRepository
      .findOne({ where: { walletAddress }, relations: ["items"] })

    if (user === undefined) { throw new Error("user not found: " + walletAddress) }
    return user;
  }

  async getAllItems(walletAddress: string): Promise<UpdateItemsDto> {
    const user = await this.findUser(walletAddress);

    const returnItemsDto = new ItemsDto(user.gold,
      user.items && user.items.map(x => new OneItemDto(x.nftId, x.grade)));
    return returnItemsDto;
  }

  async addAllItems(walletAddress: string, itemsDto: ItemsDto) {
    const user = await this.findUser(walletAddress);

    for (const itemDto of itemsDto.items) {  // in 은 인덱스, of가 'in'
      const itemEntity = new Item();
      itemEntity.nftId = itemDto.nftId;
      itemEntity.grade = itemDto.grade;
      itemEntity.user = user;
      user.items.push(itemEntity);
      this.itemRepository.save(itemEntity);
    }
    user.gold = user.gold + itemsDto.gold;
    Logger.log(user)
    this.userRepository.save(user)
  }

  async deleteAllItems(walletAddress: string, itemsDto: ItemsDto) {
    const user = await this.findUser(walletAddress);

    if (user.gold < itemsDto.gold) {
      throw new MethodNotAllowedException("user does not have items");
    }

    var haveAllItems = true;
    const currentItemNftIds = user.items.map(x => x.nftId);
    const itemIdsToDelete = itemsDto.items.map(x => x.nftId);


    Logger.log("items" + itemIdsToDelete.join(","));
    const newitems: Item[] = [];
    Logger.log(currentItemNftIds.join(","))
    for (const item of itemsDto.items) {
      if (!currentItemNftIds.includes(item.nftId)) {
        haveAllItems = false;
        throw new MethodNotAllowedException("user does not have items");
      }

    }

    const newUserItems = user.items
      .filter(itemEntity => !itemIdsToDelete.includes(itemEntity.nftId))

    // TODO: query runner and refactoring
    user.gold = user.gold - itemsDto.gold;
    user.items = newUserItems
    this.userRepository.save(user)
    const itemsToDelete = user.items
      .filter(itemEntity => itemIdsToDelete.includes(itemEntity.nftId))
    itemsToDelete.forEach((v, i) => this.itemRepository.delete(v))
  }

  async findTopScoreUser(): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder("User").orderBy("score", "DESC").getOne();

    return user;
  }

}
