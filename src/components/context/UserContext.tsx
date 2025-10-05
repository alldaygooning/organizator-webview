import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../entities/user/User";

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (u: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUserState(new User(userData._id, userData._name));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      // Save to localStorage when user is set (login)
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Remove from localStorage when user is null (logout)
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    isLoggedIn: !!user,
    setUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
