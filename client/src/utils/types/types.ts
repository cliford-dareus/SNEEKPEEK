export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface User {
  userId: string;
  username: string;
}

export interface IAuthInitialState {
  user: User | null;
  token: string | null;
  expiresAt: any | null;
}

export interface IUserData {
  username: string;
  userId: string;
  accessToken: string;
  expiresAt: any,
}

export interface IUserDataResponse {
  data: IUserData;
  status: number;
}
