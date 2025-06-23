import { createContext, useReducer, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';

interface UserToken {
  id: string;
  email: string;
  exp?: number;
}

interface State {
  user: UserToken | null;
}

interface Action {
  type: 'LOGIN' | 'LOGOUT';
  payload?: UserToken;
}

const token = localStorage.getItem('token');

const initialState: State = {
  user: token ? (jwtDecode(token) as UserToken) : null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

export const AuthContext = createContext({
  user: initialState.user,
  login: (data: UserToken & { token: string }) => {
    void data;
  },
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = (data: UserToken & { token: string }) => {
    localStorage.setItem('token', data.token);
    dispatch({ type: 'LOGIN', payload: data });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
