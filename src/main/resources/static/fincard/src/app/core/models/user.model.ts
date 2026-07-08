export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: 'owner' | 'member';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}
