import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { LoginUserDto } from 'src/_dto/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
    });
  }

  public async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<LoginUserDto> {
    const contextId = ContextIdFactory.getByRequest(request);

    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const validateUser = await authService.validateUser(
      new LoginUserDto(email, password),
    );
    console.log('CV', validateUser);
    if (!validateUser) {
      //throw new UnauthorizedException();
    }
    return validateUser;
  }
}
