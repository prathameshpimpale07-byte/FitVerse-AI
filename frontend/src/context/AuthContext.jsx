import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('fitverse_token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data.user);
    } catch {
      localStorage.removeItem('fitverse_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('fitverse_token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}! 💪`);
    return data;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('fitverse_token', res.token);
    setToken(res.token);
    setUser(res.user);
    toast.success(`Welcome to FitVerse, ${res.user.name}! 🎉`);
    return res;
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;
      
      const res = await authService.googleLogin({
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatar: firebaseUser.photoURL,
      });

      localStorage.setItem('fitverse_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome via Google, ${res.user.name}! 🚀`);
      return res;
    } catch (error) {
      toast.error('Google Sign-In failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('fitverse_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  const setAuthSession = (userObj, tokenStr) => {
    localStorage.setItem('fitverse_token', tokenStr);
    setToken(tokenStr);
    setUser(userObj);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, setAuthSession, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
