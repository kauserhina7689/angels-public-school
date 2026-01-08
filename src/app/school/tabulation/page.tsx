import PrintButton from "@/components/common/PrintButton";
import { studentResultType } from "@/lib/types";
import { getSessions } from "@/server/actions/admin/getdata";
import { getClasses } from "@/server/actions/school/getClasses";
import { getTabulationByClassId } from "@/server/actions/school/result/tabulation";
import { redirect } from "next/navigation";
import React from "react";

async function page({
  searchParams,
}: {
  searchParams: Promise<{
    class_id: string;
  }>;
}) {
  const sessions = await getSessions();

  if (sessions.sessions.length == 0)
    redirect("/school/sessions?message=Please create a session first");
  const classes = await getClasses();
  if (classes.length == 0)
    redirect(
      "/school/classes?message=Please add classes to the current session"
    );
  const params = await searchParams;
  const resp = await getTabulationByClassId(params.class_id);
  if (!resp.success) return <>{resp.message}</>;

  return (
    <div id="printArea" className=" p-8 bg-background">
      <section className="w-full py-4 flex justify-between text-primary relative">
        <h1 className="text-3xl font-extrabold">Angels public school</h1>
        <PrintButton className="">Print all tabulations</PrintButton>
      </section>
      {resp.data.map((s) => (
        <StudentReportCard key={s._id} student={s} />
      ))}
    </div>
  );
}

export default page;
interface SubjectTotals {
  totalObtained: number;
  totalMax: number;
  percentage: string;
}

interface ExamTotal {
  obtained: number;
  max: number;
}

interface StudentReportCardProps {
  student: studentResultType;
}

const StudentReportCard: React.FC<StudentReportCardProps> = ({ student }) => {
  // Get all unique exam types from the first subject (assuming all subjects have same exam types)
  const getExamTypes = (): string[] => {
    const firstSubject = Object.values(student.subjectMarks)[0];
    if (!firstSubject) return [];
    return Object.keys(firstSubject.exam);
  };

  const examTypes = getExamTypes();

  // Calculate total for a subject across all exams
  const calculateSubjectTotal = (
    subject: studentResultType["subjectMarks"][string]
  ): SubjectTotals => {
    let totalObtained = 0;
    let totalMax = 0;

    Object.values(subject.exam).forEach((exam) => {
      totalObtained += exam.obtained;
      totalMax += exam.max;
    });

    return {
      totalObtained,
      totalMax,
      percentage:
        totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0.0",
    };
  };

  // Calculate grand total across all subjects and exams
  const calculateGrandTotal = (): SubjectTotals => {
    let totalObtained = 0;
    let totalMax = 0;

    Object.values(student.subjectMarks).forEach((subject) => {
      Object.values(subject.exam).forEach((exam) => {
        totalObtained += exam.obtained;
        totalMax += exam.max;
      });
    });

    return {
      totalObtained,
      totalMax,
      percentage:
        totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00",
    };
  };

  // Calculate totals for each exam type across all subjects
  const calculateExamTotals = (): Record<string, ExamTotal> => {
    const totals: Record<string, ExamTotal> = {};

    examTypes.forEach((examType) => {
      let obtained = 0;
      let max = 0;

      Object.values(student.subjectMarks).forEach((subject) => {
        if (subject.exam[examType]) {
          obtained += subject.exam[examType].obtained;
          max += subject.exam[examType].max;
        }
      });

      totals[examType] = { obtained, max };
    });

    return totals;
  };

  const grandTotal = calculateGrandTotal();
  const examTotals = calculateExamTotals();

  // Format exam type name for display
  const formatExamName = (examType: string): string => {
    return examType
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md mb-8 last:mb-0 break-inside-avoid">
      <div className="bg-slate-100 px-6 py-4 rounded-t-lg border-b-2 border-gray-300">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Student Report Card
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
          <div>
            <span className="font-semibold">Student Name:</span> {student.name}
          </div>
          <div>
            <span className="font-semibold">Serial Number:</span>{" "}
            {student.serialNumber}
          </div>
          <div>
            <span className="font-semibold">Father&apos;s Name:</span>{" "}
            {student.fatherName}
          </div>
          <div>
            <span className="font-semibold">Mother&apos;s Name:</span>{" "}
            {student.motherName}
          </div>
          <div>
            <span className="font-semibold">Class:</span> {student.class_name}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="border border-gray-300 px-3 py-2 text-left font-bold"
                  rowSpan={2}
                >
                  Subject
                </th>
                {examTypes.map((examType) => (
                  <th
                    key={examType}
                    className="border border-gray-300 px-3 py-2 text-center font-bold"
                    colSpan={2}
                  >
                    {formatExamName(examType)}
                  </th>
                ))}
                <th
                  className="border border-gray-300 px-3 py-2 text-center font-bold"
                  colSpan={2}
                >
                  Grand Total
                </th>
                <th
                  className="border border-gray-300 px-3 py-2 text-center font-bold"
                  rowSpan={2}
                >
                  %
                </th>
              </tr>
              <tr className="bg-gray-50">
                {examTypes.map((examType) => (
                  <React.Fragment key={`${examType}-sub`}>
                    <th className="border border-gray-300  py-1 text-center text-xs">
                      Max
                    </th>
                    <th className="border border-gray-300  py-1 text-center text-xs">
                      Obt
                    </th>
                  </React.Fragment>
                ))}
                <th className="border border-gray-300  py-1 text-center text-xs">
                  Max
                </th>
                <th className="border border-gray-300  py-1 text-center text-xs">
                  Obt
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(student.subjectMarks).map(([key, subject]) => {
                const totals = calculateSubjectTotal(subject);
                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      {subject.subject_name}
                    </td>
                    {examTypes.map((examType) => (
                      <React.Fragment key={`${key}-${examType}`}>
                        <td className="border border-gray-300  py-2 text-center">
                          {subject.exam[examType]?.max ?? "-"}
                        </td>
                        <td className="border border-gray-300  py-2 text-center font-semibold">
                          {subject.exam[examType]?.obtained ?? "-"}
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="border border-gray-300  py-2 text-center bg-blue-50">
                      {totals.totalMax}
                    </td>
                    <td className="border border-gray-300  py-2 text-center font-bold bg-blue-50">
                      {totals.totalObtained}
                    </td>
                    <td className="border border-gray-300  py-2 text-center font-bold">
                      {totals.percentage}%
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-bold">
                <td className="border border-gray-300 px-3 py-2">Total</td>
                {examTypes.map((examType) => (
                  <React.Fragment key={`total-${examType}`}>
                    <td className="border border-gray-300  py-2 text-center">
                      {examTotals[examType].max}
                    </td>
                    <td className="border border-gray-300  py-2 text-center">
                      {examTotals[examType].obtained}
                    </td>
                  </React.Fragment>
                ))}
                <td className="border border-gray-300  py-2 text-center bg-blue-100">
                  {grandTotal.totalMax}
                </td>
                <td className="border border-gray-300  py-2 text-center bg-blue-100">
                  {grandTotal.totalObtained}
                </td>
                <td className="border border-gray-300  py-2 text-center">
                  {grandTotal.percentage}%
                </td>
              </tr>
              <tr className="bg-slate-100 font-bold">
                <td className="border border-gray-300 px-3 py-2">Percentage</td>
                {examTypes.map((examType) => (
                  <React.Fragment key={`total-${examType}`}>
                    <td className="border border-gray-300  py-2 text-center"></td>
                    <td className="border border-gray-300  py-2 text-center">
                      {(
                        (examTotals[examType].obtained /
                          examTotals[examType].max) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                  </React.Fragment>
                ))}
                <td className="border border-gray-300  py-2 text-center bg-blue-100">
                  {grandTotal.totalMax}
                </td>
                <td className="border border-gray-300  py-2 text-center bg-blue-100">
                  {grandTotal.totalObtained}
                </td>
                <td className="border border-gray-300  py-2 text-center">
                  {grandTotal.percentage}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <div className="text-sm">
            <p className="font-semibold">
              Result:{" "}
              <span
                className={
                  parseFloat(grandTotal.percentage) >= 33
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {parseFloat(grandTotal.percentage) >= 33 ? "PASS" : "FAIL"}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              Overall Percentage: {grandTotal.percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
