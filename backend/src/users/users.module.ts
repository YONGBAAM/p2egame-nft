import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Item } from './entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Item]),

],
  controllers: [UsersController, GameController],
  providers: [UsersService, GameService]
})
export class UsersModule {}
