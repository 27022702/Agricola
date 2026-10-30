import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, role?: 'farmer' | 'admin') => Promise<boolean>;
  register: (profile: Omit<UserProfile, 'id'>) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'farmer' | 'admin') => void;
  usersList: UserProfile[];
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'farmer-1',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@agrismart.org',
    phone: '+91 98765 43210',
    location: 'Anand, Gujarat',
    farmSizeAcres: 5.5,
    soilType: 'Alluvial Loam',
    primaryCrops: ['Tomato', 'Cotton', 'Wheat'],
    role: 'farmer'
  },
  {
    id: 'admin-1',
    name: 'Dr. S. K. Swaminathan',
    email: 'admin.swaminathan@agrismart.org',
    phone: '+91 98111 22334',
    location: 'Agricultural Research Center, New Delhi',
    farmSizeAcres: 120,
    soilType: 'Multi-regional Experimental',
    primaryCrops: ['Cereals', 'Pulses', 'Horticulture'],
    role: 'admin'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('agrismart_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('agrismart_active_user');
      return savedUser ? JSON.parse(savedUser) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('agrismart_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('agrismart_active_user');
      }
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('agrismart_users', JSON.stringify(usersList));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [usersList]);

  const login = async (email: string, targetRole?: 'farmer' | 'admin'): Promise<boolean> => {
    const existing = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setUser(existing);
      return true;
    }
    // Auto-create or login with role
    const newUser: UserProfile = {
      id: 'farmer-' + Date.now(),
      name: email.split('@')[0].replace('.', ' '),
      email,
      phone: '+91 94000 00000',
      location: 'Central Agricultural Belt',
      farmSizeAcres: 4.0,
      soilType: 'Loamy Soil',
      primaryCrops: ['Wheat', 'Rice'],
      role: targetRole || 'farmer'
    };
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const register = async (profileData: Omit<UserProfile, 'id'>): Promise<boolean> => {
    const newUser: UserProfile = {
      ...profileData,
      id: 'farmer-' + Date.now()
    };
    setUsersList(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: 'farmer' | 'admin') => {
    if (newRole === 'admin') {
      const adminUser = usersList.find(u => u.role === 'admin') || DEFAULT_USERS[1];
      setUser(adminUser);
    } else {
      const farmerUser = usersList.find(u => u.role === 'farmer') || DEFAULT_USERS[0];
      setUser(farmerUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole, usersList }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
