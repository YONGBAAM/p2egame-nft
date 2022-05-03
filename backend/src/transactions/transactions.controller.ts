import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { OnChainService } from './on-chain.service';


@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly onChainService: OnChainService
  ) { }

  @Post()
  async create(@Body() dto: CreateTransactionDto) {

    return this.transactionsService.create(dto.walletAddress, dto.transactionType == 'to_nft', dto.transactionId)
  }

  @Get("on-chain/transactions/:txid")
  async queryTransaction(@Param('txid') txid: string) {
    Logger.log(txid)
    return this.onChainService.queryTransaction(txid);
  }

  @Get("on-chain/block")
  async getBlockNumber() {
    return this.onChainService.getBlockNumber();
  }

  @Get("on-chain/nft/:nftId")
  async findOwnerOfNft(@Param("nftId") nftId: number) {
    return this.onChainService.findOwnerByNftId(nftId);
  }

  @Get("testtt/:nftId")
  async tt(@Param("nftId") nftId: number) {
    return this.onChainService.queryNftMetaData(nftId);
  }



  // find all pending


}
