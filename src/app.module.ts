import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppBot } from './app.bot';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppBot],
})
export class AppModule {}
