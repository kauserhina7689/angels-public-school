import { redirect } from "next/navigation";
import React from "react";
import LoginForm from "./login-from";
import { authenticateUser } from "@/server/actions/auth";

async function LoginPage() {
  const isAuthenticated = await authenticateUser();

  if (isAuthenticated) redirect(isAuthenticated.role);
  return <LoginForm />;
}

export default LoginPage;
