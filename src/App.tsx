import { Container } from "@mui/material";
import UserHeader from "./UserHeader";
import { NotificationProvider } from "./notification/NotificationProvider";
import { UserProvider, type User } from "./user/UserContext";
import { useState } from "react";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    setIsLoggedIn(u !== null);
  };
  return (
    <>
      <UserProvider value={{ user, isLoggedIn, setUser }}>
        <NotificationProvider>
          <Container></Container>
          <UserHeader onLogin={handleSetUser} />
        </NotificationProvider>
      </UserProvider>
    </>
  );
};

export default App;
