import { createContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string | null;
  avatar?: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAnonymous: () => Promise<void>;
  logout: () => Promise<void>;
  syncSettings: (settings: Record<string, unknown>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { User, AuthContextType };
