'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { User, StoredUser } from './types';

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (newUser: Omit<StoredUser, 'id'>) => { success: boolean; error?: string };
  updateUser: (newDetails: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean, error?: string };
  isAuthenticated: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      const authenticatedUser = localStorage.getItem('authenticatedUser');
      if (authenticatedUser) {
        const parsedUser = JSON.parse(authenticatedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("Failed to parse from local storage", e);
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const foundUser = users.find(u => u.email === email);
    if (!foundUser) {
      return { success: false, error: 'Корбар бо ин почтаи электронӣ ёфт нашуд.' };
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Парол нодуруст аст.' };
    }
    setUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem('authenticatedUser', JSON.stringify(foundUser));
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authenticatedUser');
  }, []);

  const register = useCallback((newUser: Omit<StoredUser, 'id'>) => {
    if (users.find(u => u.email === newUser.email)) {
        return { success: false, error: 'Ин почтаи электронӣ аллакай истифода шудааст.' };
    }
    const userToStore: StoredUser = { ...newUser, id: `user-${users.length + 1}`};
    const newUsers = [...users, userToStore];
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    
    // Log in the new user
    setUser(userToStore);
    setIsAuthenticated(true);
    localStorage.setItem('authenticatedUser', JSON.stringify(userToStore));
    
    return { success: true };
  }, [users]);

  const updateUser = useCallback((newDetails: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...newDetails };
      setUser(updatedUser as User);

      const updatedUsers = users.map(u => u.id === user.id ? (updatedUser as StoredUser) : u);
      setUsers(updatedUsers);
      
      localStorage.setItem('authenticatedUser', JSON.stringify(updatedUser));
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  }, [user, users]);

  const changePassword = useCallback((currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "Шумо ворид нашудаед." };

    const storedUser = users.find(u => u.id === user.id);
    if (storedUser?.password !== currentPassword) {
        return { success: false, error: "Пароли ҷорӣ нодуруст аст." };
    }
    
    const updatedUser = { ...user, password: newPassword };
    const updatedUsers = users.map(u => u.id === user.id ? ({...u, password: newPassword}) : u);
    
    setUsers(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('authenticatedUser', JSON.stringify(updatedUser));

    return { success: true };
  }, [user, users]);


  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
    changePassword,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
