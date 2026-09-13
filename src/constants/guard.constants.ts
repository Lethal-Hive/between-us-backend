export enum Strategies {
  User = 'USER_STRATEGY',
  Staff = 'Staff_STRATEGY',
}

export type UserPayload = {
  id: string;
  iat?: number;
  exp?: number;
};

export type StaffPayload = {
  id: string;
  iat?: number;
  exp?: number;
};
