import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/_models/user.entity';
import md5 from 'md5-hash';
import { ChangePasswordDto, LoginUserDto, UserDto } from 'src/_dto/user';
import { CommonResult } from 'src/_dto/common-result';

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
   * !NOT! BURANIN GÜVENLİK NEDENİYLE GÜNCELLENMESİ LAZIM. TÜM VERİLERİ GÜNCELLETMEK DOĞRU DEĞİL. EXPIRATION DATASINI DEĞİTİREBİLİR
   * Mevcut kullanıcının güncellenmesini sağlar
   * @param data Güncellenecek bilgiler
   * @param id Güncellenecek kullanıcı ID
   * @returns true or false
   */

  async updateUser(
    data: UserDto | ChangePasswordDto,
    id: number,
  ): Promise<boolean> {
    await this.USER_REPOSITORY.update<User>(data, {
      where: { id: id },
    });
    return true;
  }

  /**
   * Bir kullanıcının yeni şifre belirlemesini sağlar
   * @param data Şifre değiştirmek için gerekli olan bilgiler
   * @param id Şifre değişecek kullanıcı ID
   */
  async changePassword(
    data: ChangePasswordDto,
    id: number,
  ): Promise<CommonResult> {
    data.password = md5(data.password);
    data.new_password = md5(data.new_password);
    const user: User = await this.finOneByUserId(id);

    if (user && user.password == data.password) {
      const object: ChangePasswordDto = {
        password: data.new_password,
      };

      await this.updateUser(object, id);
      return new CommonResult(true, 'Şifreniz başarıyla güncellenmiştir.');
    } else {
      throw new HttpException(
        new CommonResult(false, 'Şifreniz uyuşmuyor!'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * ID'ye göre kullanıcı verisini döndürür.
   * @param id Kullanıcı ID'si
   * @returns  Varsa Kullanıcı verisi yoksa null;
   */
  async finOneByUserId(id: number): Promise<User> {
    return await this.USER_REPOSITORY.findOne({ where: { id: id } });
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
