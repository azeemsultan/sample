import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';
import wait from '../utils/wait';
import { User } from '../types/user';
import { subDays, subHours } from 'date-fns';

const now = new Date();

const users = [
  {
    user_id: '5e881b7612bdbc1dbb214b27',
    profile_image: '/static/mock-images/avatars/avatar-jane_rotanson.png',
    name: '',
    password: 'Password123!',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'demo@fortes.nl',
    phone_number: '+1 000 000 000',
    official_email: 'demo@fortes.nl',
    official_phone_number: '+1 000 000 000',
    neighborhood: 'Atlanta',
    street_number: 'Elvis Presly 102',
    house_number: '12A',
    postal_code: '48000',
    city: 'North Canton',
    country: 'USA',
    role_id: '5',
    is_email_verified: true,
    created_at: subDays(subHours(now, 9), 2).getTime()
  }
];

class AuthApi {
  async login({ email, password }): Promise<string> {
    await wait(500);

    return new Promise((resolve, reject) => {
      try {
        // Find the user
        const user = users.find((_user) => _user.email === email);

        if (!user || (user.password !== password)) {
          reject(new Error('Please check your email and password'));
          return;
        }

        // Create the access token
        const accessToken = sign(
          { userId: user.user_id },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        resolve(accessToken);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async register({ email, name, password }): Promise<string> {
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error('User already exists'));
          return;
        }

        user = {
          user_id: '5e881b7612bdbc1dbb214b27',
          profile_image: '/static/mock-images/avatars/avatar-jane_rotanson.png',
          name,
          password,
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'demo@fortes.nl',
          phone_number: '+1 000 000 000',
          official_email: 'demo@fortes.nl',
          official_phone_number: '+1 000 000 000',
          neighborhood: 'Atlanta',
          street_number: 'Elvis Presly 102',
          house_number: '12A',
          postal_code: '48000',
          city: 'North Canton',
          country: 'USA',
          role_id: '2',
          is_email_verified: true,
          created_at: subDays(subHours(now, 9), 2).getTime()
        };

        users.push(user);

        const accessToken = sign(
          { userId: user.user_id },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        resolve(accessToken);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(accessToken): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const { userId } = decode(accessToken) as any;

        // Find the user
        const user = users.find((_user) => _user.user_id === userId);

        if (!user) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          user_id: user.user_id,
          profile_image: user.profile_image,
          name: user.name,
          password: user.password,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          official_email: user.official_email,
          phone_number: user.phone_number,
          official_phone_number: user.official_phone_number,
          neighborhood: user.neighborhood,
          street_number: user.street_number,
          house_number: user.house_number,
          postal_code: user.postal_code,
          city: user.city,
          country: user.country,
          role_id: user.role_id,
          is_email_verified: user.is_email_verified,
          created_at: user.created_at,
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
