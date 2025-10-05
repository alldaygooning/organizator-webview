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

export const validateName = (name: string): string => {
  if (name.length === 0) {
    return "Name cannot be empty";
  }
  if (name.trim().length === 0) {
    return "Name cannot be only whitespace";
  }
  return "";
};

export const validateFullName = (fullName: string): string => {
  if (fullName.length === 0) {
    return "Full name cannot be empty";
  }
  if (fullName.trim().length === 0) {
    return "Full name cannot be only whitespace";
  }
  return "";
};

export const validateAnnualTurnover = (turnover: string): string => {
  if (turnover.length === 0) {
    return "Annual turnover cannot be empty";
  }
  const num = Number(turnover);
  if (isNaN(num)) {
    return "Annual turnover must be a valid number";
  }
  if (num <= 0) {
    return "Annual turnover must be greater than 0";
  }
  if (!Number.isInteger(num)) {
    return "Annual turnover must be an integer";
  }
  return "";
};

export const validateEmployeesCount = (count: string): string => {
  if (count.length === 0) {
    return "Employees count cannot be empty";
  }
  const num = Number(count);
  if (isNaN(num)) {
    return "Employees count must be a valid number";
  }
  if (num <= 0) {
    return "Employees count must be greater than 0";
  }
  if (!Number.isInteger(num)) {
    return "Employees count must be an integer";
  }
  return "";
};

export const validateRating = (rating: string): string => {
  if (rating.length === 0) {
    return "Rating cannot be empty";
  }
  const num = Number(rating);
  if (isNaN(num)) {
    return "Rating must be a valid number";
  }
  if (num <= 0) {
    return "Rating must be greater than 0";
  }
  return "";
};

export const validateCoordinatesX = (x: string): string => {
  if (x.length === 0) {
    return "X is required";
  }
  const xNum = Number(x);
  if (isNaN(xNum) || !Number.isInteger(xNum)) {
    return "X must be a valid integer";
  }
  if (xNum > 442) {
    return "X must be less than 443";
  }
  return "";
}

export const validateCoordinatesY = (y: string): string => {
  if (y.length === 0) {
    return "Y is required";
  }
  const yNum = Number(y);
  if (isNaN(yNum) || !Number.isInteger(yNum)) {
    return "Y must be a valid integer";
  }
  return "";
}

export const validateStreet = (street: string): string => {
  if (street.length === 0) {
    return "Street name cannot be empty";
  }
  return "";
}

export const validateZip = (zip: string): string => {
  if (zip.length === 0) {
    return "Zip cannot be empty";
  }
  return "";
}