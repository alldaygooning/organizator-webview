import type { User } from "./UserContext";

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

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
    throw new ApiError(`Login failed: ${response.status}`, response.status);
  }

  const user: User = { name: username };
  return user;
};