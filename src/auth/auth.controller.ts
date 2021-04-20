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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtVerifyAnswer } from './strategies/jwt.strategy';
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
      return await this.authService.login(currentUSer);
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Req() request): Promise<any> {
    return request.user;
  }
}
