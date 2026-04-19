const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string) => {
  return emailPattern.test(email);
};
