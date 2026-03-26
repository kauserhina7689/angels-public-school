import { redirect } from "next/navigation";
import { getSessions } from "@/server/actions/admin/getdata";
import { getClasses } from "@/server/actions/school/getClasses";
import { getTabulationByClassId } from "@/server/actions/school/result/tabulation";
import ReportSelector from "@/components/school/result/resultSelector";
import StudentReportCard from "@/components/school/result/reportCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ class_id: string }>;
}) {
  const params = await searchParams;

  const sessions = await getSessions();
  if (sessions.sessions.length === 0) {
    redirect("/school/sessions");
  }

  const classes = await getClasses();
  if (classes.length === 0) {
    redirect("/school/classes");
  }

  // validate class_id
  const classId = classes.find((c) => c._id === params.class_id)
    ? params.class_id
    : classes[0]._id;

  const resp = await getTabulationByClassId(classId);

  if (!resp.success) {
    return <div className="p-6">{resp.message}</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* SELECTOR */}
      <ReportSelector classes={classes} currentClass={classId} />

      {/* REPORT CARDS */}
      <div id="printArea" className="space-y-8">
        {resp.data.map((student) => (
          <StudentReportCard key={student._id} student={student} />
        ))}
      </div>
    </div>
  );
}
