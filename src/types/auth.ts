export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ForgetPass {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}