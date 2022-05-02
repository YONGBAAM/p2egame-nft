import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm"
import { User } from './entities/user.entity';
import { UpdateItemsDto } from './dto/update-items.dto';
import { Item } from './dto/item';


/*
Note: this is based on non-migrated versions.
Please Refactor
*/
// Service만 먼저 짜고, 컨트롤러에서 여러개 분기
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { };

  // 여기서 jwt 리턴해주고, 게임 로그인시 밸리데이트
  async findUserOrCreate(walletAddress: string): Promise<User> {
    var user = await this.userRepository.findOne({ walletAddress: walletAddress })
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
      .findOne({ where: { walletAddress }})

    if (user === undefined) { throw new Error("user not found: " + walletAddress) }
    return user;
  }

  async getAllItems(walletAddress: string): Promise<UpdateItemsDto> {
    const user = await this.findUser(walletAddress);

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

}
