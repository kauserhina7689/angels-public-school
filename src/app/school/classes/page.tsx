import AddClassDialog from "@/components/school/modals/addClass";
import ClassesPage from "@/components/school/pages/Class.page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClasses } from "@/server/actions/school/getClasses";
import { Edit, Users } from "lucide-react";
import React from "react";

async function ClassesPageServer() {
  const classes = await getClasses();

  return <ClassesPage classes={classes} />;
}

export default ClassesPageServer;
