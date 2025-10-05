import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import SignUpModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { useTheme } from "@mui/material/styles";
import { useNotification } from "../../../notification/NotificationProvider";
import { useUser } from "../../context/UserContext";

const UserHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [signUpOpen, setSignUpOpen] = React.useState(false);

  const { success } = useNotification();

  const { isLoggedIn, user, logout } = useUser();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        logout();
        success("Log-out successful", "See you later!");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        <Toolbar sx={{ gap: 1 }}>
          {isLoggedIn && user ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                overflow: "hidden",
                width: "100%",
                justifyContent: "space-between",
                minHeight: "64px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexShrink: 1,
                  minWidth: 0,
                }}
                variant="h4"
                title={user.name}
              >
                {user.name}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.error.main,
                  borderColor: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: theme.palette.error.main,
                    color: "white",
                  },
                  flexShrink: 0,
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  color: "inherit",
                }}
                onClick={() => setLoginOpen(true)}
              >
                Login
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  sx={{ fontWeight: "bold" }}
                  variant="outlined"
                  onClick={() => setSignUpOpen(true)}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default UserHeader;
