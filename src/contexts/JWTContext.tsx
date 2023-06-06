import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/user';
import { authApi } from '../api/authApi';
import jwtDecode from 'jwt-decode';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends State {
  platform: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
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
  payload: {
    user: User;
  };
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
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const currentTime = Date.now() / 1000;

  const decoded: any = jwtDecode(accessToken);

  return decoded.exp > currentTime;
};

const setSession = (data: any) => {
  if (!data) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } else {
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    if (accessToken || refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
};

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  if (!localStorage.getItem('locale')) {
    localStorage.setItem('locale', 'en');
  }
  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      payload: {
        isAuthenticated: false,
        user: null
      }
    });
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const refreshToken = window.localStorage.getItem('refreshToken');

        if (isValidToken(accessToken)) {
          const user = await authApi.me(accessToken);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else if (window.location.pathname.indexOf('login') !== -1 && !accessToken) {
          console.log('login');
        } else if (window.location.pathname.indexOf('forgot-password') !== -1) {
          console.log('forgot-password');
        } else if (window.location.pathname.indexOf('reset-password') !== -1) {
          console.log('reset-password');
        } else if (window.location.pathname.indexOf('/login') !== -1 && !accessToken) {
          window.location.href = '/login';
        } else if (refreshToken && !isValidToken(accessToken)) {
          const keycloakData = await authApi.refreshSession(refreshToken);
          if (keycloakData) {
            setSession(keycloakData);
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
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

  const login = async (email: string, password: string): Promise<void> => {
    const keycloakData = await authApi.login({ email, password });
    setSession(keycloakData);
    const loggedUser = await authApi.me(keycloakData.access_token);
    localStorage.setItem('user', JSON.stringify(keycloakData));
    dispatch({
      type: 'LOGIN',
      payload: {
        user: loggedUser
      }
    });
  };

  const logout = async (): Promise<void> => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (): Promise<void> => {
    await authApi.register();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register
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
