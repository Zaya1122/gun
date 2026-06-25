export interface IUser {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isOwner?: boolean;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IRegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface IChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
