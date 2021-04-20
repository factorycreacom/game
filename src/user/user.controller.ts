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
  Req,
  HttpException,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommonResult } from 'src/_dto/common-result';
import { ChangePasswordDto, UserDto } from 'src/_dto/user';
import { User } from 'src/_models/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('check-email/:email')
  async checkEmail(@Request() req, @Res() res, @Param() params) {
    const checker = await this.userService.checkEmailUse(params.email);
    return res.status(HttpStatus.OK).json(checker);
  }

  @Post('/create')
  async createUser(@Req() request): Promise<CommonResult> {
    try {
      const isNewUser = await this.userService.checkEmailUse(
        request.body.email,
      );
      if (isNewUser) {
        throw new HttpException(
          new CommonResult(false, 'User already exist'),
          HttpStatus.BAD_REQUEST,
        );
      }
      const newUser: User = await this.userService.createUser(request.body);
      if (newUser) {
        return new CommonResult(true, 'User succesfully created');
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        new CommonResult(false, 'Server error, try later'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit')
  async editUser(@Req() request): Promise<CommonResult> {
    try {
      await this.userService.updateUser(request.body, request.user.id);
      return new CommonResult(true, 'Bilgiler Başarıyla güncellendi.');
    } catch (error) {
      throw new HttpException(
        new CommonResult(false, 'Server error'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(
    @Req() request,
    @Body() params: ChangePasswordDto,
  ): Promise<any> {
    try {
      return await this.userService.changePassword(params, request.user.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
