import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto, UserDto } from 'src/_dto/user';
import { User } from 'src/_models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(user: LoginUserDto): Promise<UserDto> {
    try {
      const existedUser: UserDto = await this.usersService.findOneByUsernameAndPassword(
        user,
      );
      return existedUser || null;
    } catch (err) {
      return null;
    }
  }

  public async login(user: UserDto): Promise<AccessToken> {
    const payload = {
      email: user.email,
      id: user.id,
      name: user.name,
      surname: user.surname,
      status: user.status,
      role: user.role,
      expiration: user.expiration,
    };
    return {
      expireTime: '1Y',
      value: this.jwtService.sign(payload),
    };
  }

  public decode(token: string) {
    const decoded = this.jwtService.decode(token);
    return decoded ? decoded : false;
  }
}

export interface AccessToken {
  expireTime: string;
  value: string;
}
