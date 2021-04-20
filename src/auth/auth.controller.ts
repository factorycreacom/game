import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommonResult } from 'src/_dto/common-result';
import { LoginUserDto, UserDto } from 'src/_dto/user';
import { AccessToken, AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(
    @Body(new ValidationPipe()) user: LoginUserDto,
  ): Promise<AccessToken> {
    try {
      const currentUSer: UserDto = await this.authService.validateUser(user);
      if (currentUSer) {
        return await this.authService.login(currentUSer);
      } else {
        throw new HttpException(
          new CommonResult(false, 'E-Posta adresi veya Şifre Yanlış!'),
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      console.log('ERROR', err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException(
          new CommonResult(false, 'Bilinmeyen bir hata oluştu!'),
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Req() request): Promise<any> {
    return request.user;
  }
}
