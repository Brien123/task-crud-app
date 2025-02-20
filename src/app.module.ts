import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';



@Module({
  imports: [UsersModule, AuthModule, MongooseModule.forRoot('mongodb://localhost:27017/crud'), TasksModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
