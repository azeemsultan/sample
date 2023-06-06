import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { auth0Config } from '../config';
import type { User } from '../types/user';

import { subDays, subHours } from 'date-fns';

const now = new Date();

let auth0Client: Auth0Client | null = null;

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends State {
  platform: 'Auth0';
  loginWithPopup: (options?: any) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'Auth0',
  loginWithPopup: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        auth0Client = new Auth0Client({
          redirect_uri: window.location.origin,
          ...auth0Config
        });

        await auth0Client.checkSession();

        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
          const user = await auth0Client.getUser();

          // Here you should extract the complete user profile to make it
          // available in your entire app.
          // The auth state only provides basic information.

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated,
              user: {
                user_id: user.sub,
                name: 'Jane Doe',
                email: user.attributes.email,
                profile_image: '/static/mock-images/avatars/avatar-jane_rotanson.png',
                password: 'Password123!',
                first_name: 'Jane',
                last_name: 'Doe',
                phone_number: '+1 000 000 000',
                official_email: user.attributes.official_email,
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
              }
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const loginWithPopup = async (options): Promise<void> => {
    await auth0Client.loginWithPopup(options);

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();

      // Here you should extract the complete user profile to make it available in your entire app.
      // The auth state only provides basic information.

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            user_id: user.sub,
            name: 'Jane Doe',
            email: user.attributes.email,
            profile_image: '/static/mock-images/avatars/avatar-jane_rotanson.png',
            password: 'Password123!',
            first_name: 'Jane',
            last_name: 'Doe',
            phone_number: '+1 000 000 000',
            official_email: user.attributes.official_email,
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
          }
        }
      });
    }
  };

  const logout = (): void => {
    auth0Client.logout();
    dispatch({
      type: 'LOGOUT'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Auth0',
        loginWithPopup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
