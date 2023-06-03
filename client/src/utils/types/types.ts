export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface ILoginPayload {
  username: string;
  password: "";
}

export interface IAuthInitialState {
  user: [];
  token: string;
}
