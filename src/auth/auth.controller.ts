import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommonResult } from 'src/_dto/common-result';
import { UserDto } from 'src/_dto/user';
import { AccessToken, AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  //@UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(
    @Body(new ValidationPipe()) user: UserDto,
  ): Promise<AccessToken> {
    try {
      return await this.authService.login(user);
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException(
          new CommonResult(false, 'Server error'),
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
