import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import {TypeOrmModule} from "@nestjs/typeorm"
import { ConfigModule } from '@nestjs/config';
import allConfig from './config/allConfig';
import * as Joi from 'joi';
import config from 'ormconfig';
@Module({
  imports: [UsersModule, TransactionsModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/${process.env.NODE_ENV}.env`],
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
    }),
    TypeOrmModule.forRoot(),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
