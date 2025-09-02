import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userInfo) => {
    setUser(userInfo);
  };

  const logout = (navigation) => {
    setUser(null);
    // 👉 Chuyển về Login sau khi logout
    navigation.replace('Login');
    // 👉 Hiện thông báo
    alert('Đăng xuất thành công!');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}