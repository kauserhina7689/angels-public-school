"use server";
import { verifyToken } from "@/server/utils/token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("token", "");
  redirect("/login");
}
