import { User } from './../_models/user.entity';
export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
