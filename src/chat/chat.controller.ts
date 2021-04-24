import { Controller, Req, Get, HttpException, HttpStatus, Post, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Room } from 'src/_dto/room';
import { CommonResult } from 'src/_dto/common-result';

@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) { }

    @Post('/room')
    async createRoom(@Req() request): Promise<CommonResult>{
        const control = await this.chatService.findOneByRoomname(request.body.room);
        if(control){
            return new CommonResult(false, 'Bu isimde bir oda zaten mevcut.');
        }else{
            const created = await this.chatService.createRoom(request.body.room);
            return new CommonResult(true, 'Oda başarıyla oluşturuldu', created);
        }
    } 

    @Get('/rooms')
    async getAllRooms(@Req() request): Promise<Room[]> {
        try {
            const allRooms: Room[] = await this.chatService.findAllRooms();
            return allRooms.map(elem => {
                const newElem = { ...elem };
                delete newElem.messages;
                return newElem;
            }).sort((a, b) => {
                return (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0);
            });
        } catch (err) {
            throw new HttpException(new CommonResult(false, 'Server error'), HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/room/:id')
    async getRoom(@Req() request, @Param() params): Promise<Room> {
        try {
            const room: Room = await this.chatService.findOneByRoomId(params.id);
            return room
        } catch (err) {
            throw new HttpException(new CommonResult(false, 'Server error'), HttpStatus.BAD_REQUEST);
        }
    }

}

