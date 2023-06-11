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
  expiresAt: any;
}

export interface IUserDataResponse {
  user: IUserData;
  status: number;
}

export interface IRefreshTokenResponse {
  status: number;
  user: IUserData;
}

export interface IPostPayload {
  content: string;
  image: string;
}

export interface IPost {
  _id: string;
  author: {
    _id: string;
    username: string;
  };
  content: string;
  image: string;
  likes: ILikes[];
  comments: IComment[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ILikes {
  _id: string;
  username: string;
  createdAt: string;
}

export interface IComment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IRequestData {
  _id: string;
  username: string;
}
