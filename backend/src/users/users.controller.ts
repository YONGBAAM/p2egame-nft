import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateItemsDto } from './dto/update-items.dto';
import { Item } from './dto/item';
import { OnChainService } from 'src/transactions/on-chain.service';
import { sendNftDto } from 'src/transactions/dto/send-nft-dto';


// NOTE: This is raw update of items. 
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly onChainService: OnChainService

  ) { }

  @Post("user")
  async createOrLogin(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.findUserOrCreate(createUserDto.walletAddress);
  }

  @Get("inventory/:wallet")
  async getAllItems(@Param("wallet") wallet: string): Promise<UpdateItemsDto> {
    return this.usersService.getAllItems(wallet);
  }

  @Put("inventory/:wallet/gold/:amount")
  async addGold(@Param("wallet") wallet: string, @Param("amount") amount: number
  ) {
    return this.usersService.addAllItems(wallet, new UpdateItemsDto(amount, []))
  }

  @Delete("inventory/:wallet/gold/:amount")
  async removeGold(@Param("wallet") wallet: string, @Param("amount") amount: number
  ) {
    if (amount < 0) {
      throw new Error("amount must be greater than 0")
    }
    const dto = new UpdateItemsDto(amount, []);
    return this.usersService.deleteAllItems(wallet, dto)
  }

  @Put("inventory/:wallet/items/:nftId")
  async addItem(@Param("wallet") wallet: string, @Param("nftId") nftId: number
  ) {
    const itemMetadata = await this.onChainService.queryNftMetaData(nftId);
    const item = new Item(nftId, itemMetadata.attributes);
    const dto = new UpdateItemsDto(0, [item]);
    return this.usersService.addAllItems(wallet, dto)
  }

  @Delete("inventory/:wallet/items/:nftId")
  async removeItem(@Param("wallet") wallet: string, @Param("nftId") nftId: number
  ) {
    const item = new Item(nftId, []);
    const dto = new UpdateItemsDto(0, [item]);
    return this.usersService.deleteAllItems(wallet, dto)
  }

  @Post("inventory/:wallet/items")
  async addItems(@Param("wallet") wallet: string,
    @Body() updateItemsDto: UpdateItemsDto
  ) {
    return this.usersService.addAllItems(wallet, updateItemsDto)
  }

  // Not tested yet.
  @Post("transactions/on-chain/nft")
  async sendNft(@Body() dto: sendNftDto) {
    const user = await this.usersService.findUser(dto.toAccount);
    const haveNftIds = user.items.map(item => item.nft_id);
    if (!haveNftIds.includes(dto.nftId)) {
      throw new Error("user not have item in account: " + dto.nftId);
    }
    return this.onChainService.rawSendNft(dto.toAccount, dto.nftId);
  }



}
