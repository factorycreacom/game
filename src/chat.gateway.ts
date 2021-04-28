import { OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
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
    const userData = {
      name: veri.name,
      email: veri.email,
    };
    client['user'] = userData;
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
      this.getRoomUsers(data);
      return { event: 'connectedRoom' };
    } catch (error) {
      console.log('ERR', error);
      return { event: 'notConnectedRoom' };
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, data: string) {
    try {
      client.leave(data);
      this.getRoomUsers(data);
      return { event: 'leaveRoom' };
    } catch (error) {
      console.log('ERR', error);
      return { event: 'notLeaveRoom' };
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

  async getRoomUsers(room: string) {
    const clientIdList: string[] = await new Promise((resolve) => {
      const d: any = this.server.of('/').in(room);
      d.clients((err, clients: string[]) => {
        resolve(clients);
      });
    });

    const userNames = clientIdList.map((clientId: string) => {
      // socketio-jwt has incorrect type
      return this.server.sockets.sockets[clientId].user;
    });
    this.server.to(room).emit('room_user_list', userNames);
    return userNames;
  }
}

interface GatewayEventInterface<T> {
  event: string;
  data: any;
}
