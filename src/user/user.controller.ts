import {
  Controller,
  Get,
  Request,
  Param,
  Res,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('check-email/:email')
  async checkEmail(@Request() req, @Res() res, @Param() params) {
    const checker = await this.userService.checkEmailUse(params.email);
    return res.status(HttpStatus.OK).json(checker);
  }
}
