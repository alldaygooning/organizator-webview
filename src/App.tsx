import { NotificationProvider } from "./notification/NotificationProvider";
import { OrgTable } from "./components/ui/table/OrgTable";
import { Box, Container } from "@mui/material";
import { DatabaseProvider } from "./components/context/DatabaseContext";
import { UserProvider } from "./components/context/UserContext";
import UserHeader from "./components/ui/user/UserHeader";
import { SSEEventListener } from "./components/context/SSEListener";

const App = () => {
  return (
    <>
      <NotificationProvider>
        <DatabaseProvider>
          <UserProvider>
            <Container>
              <UserHeader />
              <Box mt={1}>
                <OrgTable />
              </Box>
            </Container>
            <SSEEventListener />
          </UserProvider>
        </DatabaseProvider>
      </NotificationProvider>
    </>
  );
};

export default App;
