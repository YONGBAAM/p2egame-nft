import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { OnChainService } from './on-chain.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction])


  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, OnChainService]
})
export class TransactionsModule {}