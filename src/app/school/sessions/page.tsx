import SessionsPage from "@/components/school/pages/sessions.page";
import { getSessions } from "@/server/actions/admin/getdata";
import React from "react";

async function SessionsPageServer() {
  const resp = await getSessions();
  return <SessionsPage {...resp} />;
}

export default SessionsPageServer;
