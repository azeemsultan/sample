import { subDays, subHours } from 'date-fns';
import type { User } from '../types/user';

const now = new Date();

class UserApi {
  getUsers(): Promise<User[]> {
    const users: User[] = [
      {
        user_id: '5e881b7612bdbc1dbb214b27',
        profile_image: '/static/mock-images/avatars/avatar-jane_rotanson.png',
        name: '',
        password: 'Password123!',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'demo@fortes.nl',
        phone_number: '+1 000 000 000',
        official_email: 'carson.darrin@fortes.nl',
        official_phone_number: '+1 000 000 000',
        neighborhood: 'Atlanta',
        street_number: 'Elvis Presly 102',
        house_number: '12A',
        postal_code: '48000',
        city: 'North Canton',
        country: 'USA',
        role_id: '2',
        is_email_verified: true,
        updated_at: subDays(subHours(now, 9), 2).getTime()
      },
    ];

    return Promise.resolve(users);
  }

  getUser(): Promise<User> {
    const user: User = {
      user_id: '5e881b7612bdbc1dbb214b27',
      profile_image: '/static/mock-images/avatars/avatar-jane_rotanson.png',
      name: '',
      password: 'Password123!',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'demo@fortes.nl',
      phone_number: '+1 000 000 000',
      official_email: 'carson.darrin@fortes.nl',
      official_phone_number: '+1 000 000 000',
      neighborhood: 'Atlanta',
      street_number: 'Elvis Presly 102',
      house_number: '12A',
      postal_code: '48000',
      city: 'North Canton',
      country: 'USA',
      role_id: '2',
      is_email_verified: true,
      updated_at: subDays(subHours(now, 9), 2).getTime()
    };

    return Promise.resolve(user);
  }
}

export const userApi = new UserApi();
