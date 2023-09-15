import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppBot } from './app.bot';
import { SchedulerService } from './schedular.service';
import { MongoDBService } from './mongo.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppBot, SchedulerService, MongoDBService],
})
export class AppModule {}
