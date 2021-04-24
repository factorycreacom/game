import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from 'src/chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from 'src/schemas/room.schema';

@Module({
  imports: [AuthModule,MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
