import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm"

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) { };

  async create(walletAddress: string, toNft: boolean, transactionId: string) {
    const currentTx = await this.transactionRepository.findOne({ transactionId: transactionId })
    if (currentTx) {
      throw new Error(`Transaction ${transactionId} already exists`);
    }
    const tx = new Transaction();
    tx.transactionId = transactionId;
    tx.walletAddress = walletAddress;
    tx.transactionType = toNft ? 'to_nft' : 'to_game';
    tx.status = 'submitted';
    tx.blockCount = -1;

    await this.transactionRepository.save(tx)
  }

  // where blockcount <5 and status is 'submitted'
  async findAllPending() {
    return `This action returns all transactions`;
  }

  // Routinely check and add or delete items from inventory
}
