import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        return null;
      }
      const parsedUser = JSON.parse(storedUser);
      // Garante que notificationsEnabled existe e tem um valor booleano
      if (typeof parsedUser.notificationsEnabled === 'undefined') {
        parsedUser.notificationsEnabled = true;
      }
      return parsedUser;
    } catch (error) {
      console.error('Falha ao localizar dados do usuário', error);
      return null;
    }
  });
   
  const login = (userData) => {
    // Garante que notificationsEnabled existe e tem um valor booleano
    if (typeof userData.notificationsEnabled === 'undefined') {
      userData.notificationsEnabled = true;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
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