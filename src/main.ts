import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Adjust to match your JWT payload structure
    }
  }
}


bootstrap();
