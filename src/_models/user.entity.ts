import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { City } from './city.entity';

@Table
export class User extends Model<User> {
  static validate() {
    throw new Error('Method not implemented.');
  }

  @BelongsTo(() => City, { onDelete: 'no action' })
  cityId: City;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    allowNull: false,
  })
  surname: string;

  @Column({
    allowNull: false,
    validate: {
      len: {
        args: [3, 128],
        msg: 'E-posta adresi 3 ile 128 karakter aralığında olmalıdır.',
      },
      isEmail: {
        msg: 'Geçersiz E-posta adresi.',
      },
    },
  })
  email: string;

  @Column({
    allowNull: false,
  })
  password: string;

  @Column({
    allowNull: false,
  })
  birthdate: Date;

  @ForeignKey(() => City)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  city: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  job: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    allowNull: false,
    defaultValue: 1,
  })
  status: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'user',
  })
  role: string;

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
  @DeletedAt public deletedAt: Date;

  indexes: [
    {
      unique: true;
      fields: ['email', 'phone', 'id'];
    },
  ];
}
