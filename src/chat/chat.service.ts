import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Room } from 'src/_dto/room';
import * as mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ChatService {
    private readonly rooms=[];
    constructor(@InjectModel('Room') private readonly roomModel){}

    async findAllRooms(): Promise<Room[]> {
        return await this.roomModel.find().lean().exec();
      }

      async findOneByRoomname(title: string): Promise<Room> {
        return await this.roomModel.findOne({ 'title': title }).exec();
      }

      async findOneByRoomId(id: string): Promise<Room> {
        return await this.roomModel.findOne({ '_id': id }).lean().exec();
      }
    

      async createRoom(room: string): Promise<string> {
        const createdRoom = new this.roomModel({title: room});
        const newRoom =  await createdRoom.save();
        return newRoom;
      }

      async addMessageRomm(data:any) :Promise<any> {
        const updatedRoom: Room = await this.roomModel.findOneAndUpdate({ _id: new ObjectId(data.roomId) },
        { $push: { messages: { username: data.username, text: data.text } } });

        if(updatedRoom){return true;}else{return false;}
      }


}
