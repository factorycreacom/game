import { OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { WsGuard } from './auth/guards/ws-auth.guard';
import { ChatService } from './chat/chat.service';
@WebSocketGateway()
export class ChatGateway implements OnModuleInit, OnGatewayConnection {
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('INİT');
  }

  /**
   * Kullanıcı ilk bağlandığında token geçerliliğini kontrol edip ona göre true false döndüreceğiz.
   */

  handleConnection(client: Socket) {
    const token = client.handshake.query.token.toString();
    const veri: any = this.authService.decode(token);
    let returned: boolean;
    if (veri) {
      returned = true;
    } else {
      returned = false;
    }
    const socketData = {
      message: returned,
    };
    client.emit('login', socketData);
    client.emit('message', { username: 'Sistem', text: 'Hoş geldiniz' });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async joinroom(client: Socket, data: string) {
    try {
      client.join(data);
      const clientIdList: string[] = await new Promise((resolve) => {
        console.log(this.server.sockets['clients']);
      });
      return { event: 'connectedRoom' };
    } catch (error) {
      return { event: 'notConnectedRoom' };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  async message(
    client: Socket,
    data: any,
  ): Promise<
    GatewayEventInterface<{ text: string; username: string; room: string }>
  > {
    const token = client.handshake.query.token.toString();
    const user: any = this.authService.decode(token);
    data.username = user.email;

    this.chatService.addMessageRomm(data);

    const event = 'message';
    const payload = { text: data.text, username: data.username };
    client.to(data.room).emit(event, payload);
    return { event, data: payload };
  }
}

interface GatewayEventInterface<T> {
  event: string;
  data: any;
}
