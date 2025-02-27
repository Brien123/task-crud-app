import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(process.env.PORT ?? 5000);
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}


bootstrap();
