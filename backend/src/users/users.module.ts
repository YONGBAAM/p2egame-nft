import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TransactionsModule
],
  controllers: [UsersController, GameController],
  providers: [UsersService, GameService]
})
export class UsersModule {}
