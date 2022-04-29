import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateItemsDto } from './dto/update-items.dto';
import { OneItemDto } from './dto/one-item-dto';


// NOTE: This is raw update of items. 
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("user")
  async createOrLogin(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.findUserOrCreate(createUserDto.walletAddress);
  }

  @Get("inventory/:wallet")
  async getAllItems(@Param("wallet") wallet: string): Promise<UpdateItemsDto> {
    return this.usersService.getAllItems(wallet);
  }

  @Post("inventory/:wallet/gold")
  async addGold(@Param("wallet") wallet: string,
    @Body() updateItemsDto: UpdateItemsDto
  ) {
    return this.usersService.addAllItems(wallet, updateItemsDto)
  }

  @Delete("inventory/:wallet/gold/:amount")
  async removeGold(@Param("wallet") wallet: string,
    @Param("amount") amount: number
  ) {
    if (amount < 0) {
      throw new Error("amount must be greater than 0")
    }
    const dto = new UpdateItemsDto(amount, []);
    return this.usersService.deleteAllItems(wallet, dto)
  }

  @Post("inventory/:wallet/items")
  async addItems(@Param("wallet") wallet: string,
    @Body() updateItemsDto: UpdateItemsDto
  ) {
    return this.usersService.addAllItems(wallet, updateItemsDto)
  }


  @Delete("inventory/:wallet/items/:nftId")
  async removeOneItem(@Param("wallet") wallet: string,
    @Param("nftId") nftId: string
  ) {
    const item = new OneItemDto(nftId, 0);
    const dto = new UpdateItemsDto(0, [item]);
    return this.usersService.deleteAllItems(wallet, dto)
  }

}
