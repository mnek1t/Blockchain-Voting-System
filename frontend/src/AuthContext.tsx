import { createContext, useContext } from 'react';
import { AuthUserDataResponse } from './types';

interface UserContextType {
    user: AuthUserDataResponse | null;
}

export const AuthContext = createContext<UserContextType>({ user: null });

export const useUser = () => useContext(AuthContext);
