export interface AuthCredentials {
  email: string;
  password: string;
}

export type RegisterPayload = AuthCredentials;

export interface RegisterResponse {
  message: string;
}

export interface RegisterFormValues extends RegisterPayload {
  confirmPassword: string;
}

export type LoginPayload = AuthCredentials;

export type LoginFormValues = LoginPayload;

export interface AuthUser {
  username: string;
}

export interface AuthApiErrorResponse {
  message?: string;
}
