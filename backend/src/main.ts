import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'prod') ? 'prod.env'
      : (process.env.NODE_ENV === 'stage') ? 'stage.env' : 'dev.env'
  )
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({maxAge:10, origin:"/**"});
  await app.listen(3000);
}
bootstrap();
