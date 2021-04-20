import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TopicModule } from './topic/topic.module';

@Module({
  imports: [DbModule, UserModule, AuthModule, TopicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
