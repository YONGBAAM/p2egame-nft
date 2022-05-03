import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import {TypeOrmModule} from "@nestjs/typeorm"
import { ConfigModule } from '@nestjs/config';
import allConfig from './config/allConfig';
import * as Joi from 'joi';
@Module({
  imports: [UsersModule, TransactionsModule,
    ConfigModule.forRoot(
      {
      envFilePath: [`.${process.env.NODE_ENV}.env`],
      load: [allConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        NFT_DB_HOST: Joi.string()
          .required(),
          NFT_DB_USERNAME: Joi.string()
          .required(),
          NFT_DB_DATABASE: Joi.string()
          .required(),
          CHAIN_RPC_ENDPOINT: Joi.string()
          .required().uri(),
          CHAIN_OWNER_ACCOUNT:Joi.string()
          .required(),
          CHAIN_CONTRACT_ADDRESS:Joi.string()
          .required(),
          NFT_DB_SYNCHRONIZE: Joi.string()
          .required(),

      })
    }
    ),
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: process.env.NFT_DB_HOST,
        port: 5432,
        username: process.env.NFT_DB_USERNAME,
        password: process.env.NFT_DB_PASSWORD,
        database: process.env.NFT_DB_DATABASE,
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: (process.env.NFT_DB_SYNCHRONIZE === "true") ? true:false, // TODO: DO NOTT TRUE IN PROD, USE DOTENV or sth
      }
    ),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
