import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/_models/user.entity';
import md5 from 'md5-hash';
import { LoginUserDto } from 'src/_dto/user';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly USER_REPOSITORY: typeof User,
  ) {}

  /**
   * Bir E-Posta'nın kayıtlı olup olmadığını kontrol eder
   * @param email Kontrol edilecek email
   */
  async checkEmailUse(email: string): Promise<User> {
    try {
      const user: User = await this.USER_REPOSITORY.findOne({
        where: {
          email: email,
        },
        raw: true,
      });
      if (user) {
        throw new HttpException(
          'Belirtilen E-Posta adresi kayıtlı!',
          HttpStatus.CONFLICT,
        );
      } else {
        return user;
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Yeni bir kullanıcı kaydı oluşturur.
   * @param user USerDTO tipinde bir kullanıcı verisi
   * @returns USer tipinde geri dönüş.
   */
  async createUser(user: User): Promise<User> {
    await this.checkEmailUse(user.email);
    try {
      user.password = md5(user.password);
      const save = await this.USER_REPOSITORY.create<User>(user);
      return save;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Bir kullanıcının email ve şifre ile login olmasını sağlar
   * @param user LoginUserDto tipinde login bilgisi
   * @returns Varsa kullanıcı, yoksa null
   */

  async findOneByUsernameAndPassword(user: LoginUserDto): Promise<User> {
    try {
      user.password = md5(user.password);
      return await this.USER_REPOSITORY.findOne({
        where: {
          email: user.email,
          password: user.password,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
