import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from 'src/_models/city.entity';
import { User } from 'src/_models/user.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'factorycrea.com',
      port: 3306,
      username: 'game_sikayet',
      password: 'Karaduman898',
      database: 'game_sikayet',
      models: [City, User],
      synchronize: true,
      autoLoadModels: true,
    }),
  ],
})
export class DbModule {}
