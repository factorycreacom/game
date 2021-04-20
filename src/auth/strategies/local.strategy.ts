import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginUserDto } from 'src/_dto/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(
      new LoginUserDto(email, password),
    );
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
