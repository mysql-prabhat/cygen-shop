import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    // Add custom property to session
    googleJwt?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // Add custom property to JWT token
    googleJwt?: string | null;
  }
}
