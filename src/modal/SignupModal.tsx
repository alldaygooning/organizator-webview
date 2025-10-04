import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useNotification } from "../notification/NotificationProvider";
import { validateUsername, validatePassword } from "../user/validation";
import { loginUser } from "../user/login";
import type { User } from "../user/UserContext";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  onLogin(user: User): void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  open,
  onClose,
  onLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const { success, error } = useNotification();

  const validateRepeatPassword = (value: string) => {
    if (value !== password) {
      return "Passwords do not match";
    }
    return "";
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
    if (repeatPassword) {
      setRepeatPasswordError(validateRepeatPassword(repeatPassword));
    }
  };

  const handleRepeatPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setRepeatPassword(value);
    setRepeatPasswordError(validateRepeatPassword(value));
  };

  const handleSignUp = async () => {
    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);
    const repeatPasswordValidation = validateRepeatPassword(repeatPassword);

    setUsernameError(usernameValidation);
    setPasswordError(passwordValidation);
    setRepeatPasswordError(repeatPasswordValidation);

    if (
      !usernameValidation &&
      !passwordValidation &&
      !repeatPasswordValidation
    ) {
      try {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            password: password,
          }),
        });

        if (response.ok) {
          success("Account created", "Thank you for joining us!");

          try {
            const user: User = await loginUser(username, password);
            success("Welcome!", "You have been automatically logged in.");
            onLogin(user);
          } catch (err) {
            error("Account created", "Please log in manually.");
          }

          onClose();
          setUsername("");
          setPassword("");
          setRepeatPassword("");
        } else if (response.status === 409) {
          setUsernameError("Username is already taken");
        } else {
          error(
            "Error",
            "Error occurred creating account, please try again later."
          );
        }
      } catch (err) {
        error(
          "Unexpected server error",
          "Unexpected error occurred creating account. We are trying hard to fix this."
        );
      }
    }
  };

  const isFormValid = !usernameError && !passwordError && !repeatPasswordError;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Organization management awaits...
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
        <TextField
          label="Repeat Password"
          type="password"
          fullWidth
          margin="normal"
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          error={!!repeatPasswordError}
          helperText={repeatPasswordError}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          sx={{ fontWeight: "bold" }}
          variant="contained"
          onClick={handleSignUp}
          disabled={!isFormValid}
        >
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignUpModal;
