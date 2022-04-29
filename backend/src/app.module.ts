import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import {TypeOrmModule} from "@nestjs/typeorm"
@Module({
  imports: [UsersModule, TransactionsModule,
  
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: '1234',
      database: 'test2',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // TODO: DO NOTT TRUE IN PROD, USE DOTENV or sth
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
