import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Check Necessary env variables exist

  app.enableCors({maxAge:10, origin:"/**"});
  await app.listen(3000);
}
bootstrap();
