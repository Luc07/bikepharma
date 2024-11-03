import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();
const SECRET_KEY = `${process.env.MY_SECRET_KEY}`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const saveUser = (userData) => {
    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
    localStorage.setItem('user', encryptedUser);
  };

  const loadUser = () => {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedUser);
      } catch (error) {
        console.error('Erro ao descriptografar o user:', error);
        localStorage.removeItem('user');
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (id) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/usuario/${id}`);
      setUser(response.data);
      saveUser(response.data);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
