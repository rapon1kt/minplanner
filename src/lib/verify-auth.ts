import Unauthorized from "@/errors/unauthorized-error";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export type VerifiedUser = Session["user"];

export async function getVerifiedUser(): Promise<VerifiedUser> {
  const session = await auth();
  if (!session?.user) {
    throw new Unauthorized();
  }
  return session.user as VerifiedUser;
}
