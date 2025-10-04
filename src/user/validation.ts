export const validateUsername = (username: string): string => {
  if (username.length === 0) {
    return "Username cannot be empty";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (username.length > 50) {
    return "Username must be less than 50 characters";
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "Username can only contain letters and numbers";
  }
  return "";
};

export const validatePassword = (password: string): string => {
  if (password.length === 0) {
    return "Password cannot be empty";
  }
  return "";
};