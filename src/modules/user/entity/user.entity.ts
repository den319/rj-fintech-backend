import { hashValue, compareHash } from "../../../utils/bcrypt";

export enum UserRole {
  ADMIN = "ADMIN",
}

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  async hashPassword() {
    this.password = await hashValue(this.password);
  }

  async comparePassword(password: string) {
    return compareHash(password, this.password);
  }

  toResponse() {
    const { password: _password, ...result } = this;
    return result;
  }
}
