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
@WebSocketGateway()
export class ChatGateway implements OnModuleInit, OnGatewayConnection {
  constructor(private authService: AuthService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    console.log('INİT');
  }

  handleConnection(client: Socket) {
    console.log('GELDI');
    const token = client.handshake.query.token.toString();
    const veri: any = this.authService.decode(token);
    console.log(veri);
    const socketData = {
      message: 'Hoş geldiniz',
    };
    client.emit('welcome', socketData);
  }

  @SubscribeMessage('test')
  async test(client: Socket, data: any) {
    console.log('TEST');
    return data;
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('i am client')
  async message(client: Socket, data: any) {
    /** Socket Kullanıcısının adını bulma
     * this.server.sockets['connected'][client.id].handshake.query.user,
     * */

    return data;
  }
}
