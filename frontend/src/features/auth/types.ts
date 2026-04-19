export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface RegisterFormValues extends RegisterPayload {
  confirmPassword: string;
}

export interface AuthApiErrorResponse {
  message?: string;
}
