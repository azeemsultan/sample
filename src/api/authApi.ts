import { KeycloakLogin } from '../types/keycloak_login';
import { User } from '../types/user';
import axios from 'axios';
import parse from 'src/utils/parse';
import { isUndefined } from 'lodash';
import jwtDecode from 'jwt-decode';
import logger from 'src/utils/logger';
import i18next from 'i18next';

class AuthApi {
  async login({ email, password }): Promise<KeycloakLogin> {
    return new Promise((resolve, reject) => {
      try {
        // Find the user
        axios.post(`${process.env.REACT_APP_USERS_URL}/user/loginWithCred`, {
          username: email,
          password,
          grant_type: 'password',
          client_id: 'IT22-CLIENT',
          client_secret: 'mLhppBvsQx87LTNKKgUwab6NoNcN4GsF'
        })
          .then((response) => {
            response = parse(response);
            if (!isUndefined(response?.data)) {
              const data = response?.data;
              resolve(data);
            } else {
              reject(new Error(i18next.t('login_credentials_error')));
              reject(new Error(i18next.t('Please check your email and password')));
            }
          })
          .catch((error) => {
            logger('error', error);
            reject(new Error(i18next.t('Please check your email and password')));
            // reject(new Error(i18next.t('login_api_error')));
          });
      } catch (err) {
        logger('[Auth Api]:', err);
        // reject(new Error(i18next.t('login_api_error')));
        reject(new Error(i18next.t('Please check your email and password')));
      }
    });
  }

  async register(): Promise<void> {
    console.log('register');
  }

  me(accessToken): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const decoded: any = jwtDecode(accessToken);
        if (!decoded) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          user_id: decoded?.sub,
          name: decoded.name,
          email: decoded.email,
        });
      } catch (err) {
        reject(new Error('Invalid authorization token'));
      }
    });
  }

  async refreshSession(refreshToken): Promise<KeycloakLogin> {
    return new Promise((resolve, reject) => {
      try {
        // Find the user
        axios.post(`${process.env.REACT_APP_USERS_URL}/user/refreshToken`, {
          refreshToken
        })
          .then((response) => {
            response = parse(response);
            if (!isUndefined(response?.data)) {
              const data = response?.data;
              localStorage.setItem('accessToken', data?.access_token);
              localStorage.setItem('refreshToken', data?.refresh_token);
              resolve(data);
            } else {
              reject(new Error('Please check your email and password'));
            }
          })
          .catch((error) => {
            logger(error, 'error');
            reject(new Error('Token Expired'));
          });
      } catch (err) {
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
