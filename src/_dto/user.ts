export class UserDto {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  birthdate: Date;
  city: number;
  job: string;
  phone: string;
  status: number;
  role?: string;
  expiration: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export class ChangePasswordDto {
  password: string;
  new_password?: string;
}

export class LoginUserDto {
  id?: number;
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
