import {
  Table,
  Column,
  Model,
  DataType,
  DeletedAt,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table
export class City extends Model<City> {
  static validate() {
    throw new Error('Method not implemented.');
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column({
    allowNull: false,
  })
  city: string;

  @Column({
    allowNull: false,
  })
  country: string;

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
  @DeletedAt public deletedAt: Date;

  indexes: [
    {
      unique: true;
      fields: ['city', 'id'];
    },
  ];
}
