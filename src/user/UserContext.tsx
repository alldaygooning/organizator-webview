import React, { createContext, useContext } from "react";

export interface User {
  name: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (u: User | null) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  value: UserContextType;
}> = ({ children, value }) => (
  <UserContext.Provider value={value}>{children}</UserContext.Provider>
);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
