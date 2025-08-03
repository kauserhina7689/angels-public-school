import { authenticateUser } from "@/server/actions/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const isAuthenticated = await authenticateUser();
  if (!isAuthenticated) redirect("/login");
  redirect(isAuthenticated.role);
  return <></>;
}
