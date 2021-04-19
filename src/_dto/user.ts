export class UserDto {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  birthdate: Date;
  city: number;
  job: string;
  phone: number;
  status: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}
