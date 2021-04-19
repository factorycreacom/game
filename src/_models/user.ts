export class UserDto {
  name: string;
  surname: string;
  email: string;
  password: string;
  birthdate: Date;
  city: string;
  job: string;
  phone: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}
