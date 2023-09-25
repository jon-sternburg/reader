import NextAuth from "next-auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User extends IUser {}
  interface Session extends DefaultSession {
    expires: string;
    user: User;
  }
}

interface IUser extends DefaultUser {
  email: string;
  role: string;
  _id: string;
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
