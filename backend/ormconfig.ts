import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.NFT_DB_HOST,
  port: 5432,
  username: process.env.NFT_DB_USERNAME,
  password: process.env.NFT_DB_PASSWORD,
  database: process.env.NFT_DB_DATABASE,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  synchronize: (process.env.NFT_DB_SYNCHRONIZE === "true") ? true:false, // TODO: DO NOTT TRUE IN PROD, USE DOTENV or sth
  logging: process.env.NODE_ENV !== 'production',
};

export =  config;