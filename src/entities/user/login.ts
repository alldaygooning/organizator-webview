import { ApiException } from "../../exception";
import { User } from "./User";

export const loginUser = async (username: string, password: string): Promise<User> => {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new ApiException(`Login failed: ${response.status}`, response.status);
  }

  const userData = await response.json();

  const user: User = new User(userData.id, username);
  return user;
};