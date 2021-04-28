import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';

const mongoDB = `mongodb+srv://admin:Karaduman898@cluster0.mnavq.mongodb.net/chat`;

@Module({
  imports: [
    DbModule,
    UserModule,
    AuthModule,
    ChatModule,
    MongooseModule.forRoot(mongoDB),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
