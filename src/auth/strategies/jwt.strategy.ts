import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'deneme',
    });
  }

  async validate(
    payload: JwtVerifyAnswer,
  ): Promise<{ email: string; id: number; role: string }> {
    return { email: payload.email, id: payload.id, role: payload.role };
  }
}

export interface JwtVerifyAnswer {
  exp?: number;
  iat?: number;
  email: string;
  id: number;
  role: string;
}
