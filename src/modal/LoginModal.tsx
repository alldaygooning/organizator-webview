import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { validateUsername, validatePassword } from "../user/validation";
import { ApiError, loginUser } from "../user/login";
import { useNotification } from "../notification/NotificationProvider";
import type { User } from "../user/UserContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin(user: User): void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLogin }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const { success, error } = useNotification();

  const handleLogin = async () => {
    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);

    setUsernameError(usernameValidation);
    setPasswordError(passwordValidation);

    if (!usernameValidation && !passwordValidation) {
      try {
        const user: User = await loginUser(username, password);
        success("Log-in successful", "Welcome back!");
        onLogin(user);
        onClose();
        setUsername("");
        setPassword("");
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setPassword("");
            setUsernameError("Check if username is correct");
            setPasswordError("Check if password is correct");
            error(
              "Invalid credentials",
              "Please make sure username and password are correct"
            );
          } else {
            error(
              "Error",
              "Error occurred during log-in, please try again later."
            );
          }
        } else {
          error(
            "Unexpected server error",
            "Unexpected error occurred during log-in. We are trying hard to fix this."
          );
        }
      }
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const isFormValid = !usernameError && !passwordError;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Already have an account with us?
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={handleUsernameChange}
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ fontWeight: "bold" }}
          disabled={!isFormValid}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
