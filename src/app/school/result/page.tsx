import { redirect } from "next/navigation";
import { getSessions } from "@/server/actions/admin/getdata";
import { getClasses } from "@/server/actions/school/getClasses";
import { getTabulationByClassId } from "@/server/actions/school/result/tabulation";
import ReportSelector from "@/components/school/result/resultSelector";
import StudentReportCard from "@/components/school/result/reportCard";

// helper to calculate percentage
function calculatePercentage(student: any) {
  let obtained = 0;
  let max = 0;

  Object.values(student.subjectMarks).forEach((subject: any) => {
    Object.values(subject.exam).forEach((exam: any) => {
      obtained += exam.obtained;
      max += exam.max;
    });
  });

  return max > 0 ? (obtained / max) * 100 : 0;
}

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

  // ---------------- RANK CALCULATION ----------------
  let rank = 1;

  const rankedStudents = resp.data
    .map((student) => ({
      ...student,
      percentage: calculatePercentage(student),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .map((student, index, arr) => {
      if (index > 0 && student.percentage < arr[index - 1].percentage) {
        rank = index + 1;
      }
      return {
        ...student,
        rank,
      };
    });

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* SELECTOR */}
      <ReportSelector classes={classes} currentClass={classId} />

      {/* REPORT CARDS */}
      <div id="printArea" className="space-y-8">
        {rankedStudents
          .sort((a, b) => Number(a.rollnumber) - Number(b.rollnumber)) // keep UI sorted
          .map((student) => (
            <StudentReportCard key={student._id} student={student} />
          ))}
      </div>
    </div>
  );
}
