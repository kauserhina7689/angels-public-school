"use client";

import React, { useState } from "react";
import { studentResultType } from "@/lib/types";
import { examTypes as EXAM_CONFIG } from "@/lib/utils";
import Image from "next/image";

interface Props {
  student: studentResultType;
}

interface SubjectTotals {
  totalObtained: number;
  totalMax: number;
  percentage: string;
}

interface ExamTotal {
  obtained: number;
  max: number;
  percentage: string;
}

interface AttendanceData {
  totalWorkingDays: number;
  daysPresent: number;
  percentage: string;
}

const StudentReportCard: React.FC<Props> = ({ student }) => {
  // State for editable attendance
  const [attendance, setAttendance] = useState<AttendanceData>({
    totalWorkingDays: 194,
    daysPresent: 165,
    percentage: ((165 / 180) * 100).toFixed(1),
  });

  // State for remarks
  const [remarks, setRemarks] = useState<string>(
    "Good academic performance. Shows consistent effort and improvement.",
  );
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);

  // ✅ ORDERED exam types
  const getExamTypes = (): string[] => {
    const firstSubject = Object.values(student.subjectMarks)[0];
    if (!firstSubject) return [];

    const availableExams = Object.keys(firstSubject.exam);

    return Object.keys(EXAM_CONFIG).filter((exam) =>
      availableExams.includes(exam),
    );
  };

  const examTypes = getExamTypes();

  // ---------------- SUBJECT TOTAL ----------------
  const calculateSubjectTotal = (
    subject: studentResultType["subjectMarks"][string],
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

  // ---------------- GRAND TOTAL ----------------
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

  // ---------------- EXAM TOTAL ----------------
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

      totals[examType] = {
        obtained,
        max,
        percentage: max > 0 ? ((obtained / max) * 100).toFixed(1) : "0.0",
      };
    });

    return totals;
  };

  // Handle attendance input changes
  const handleAttendanceChange = (
    field: keyof AttendanceData,
    value: number,
  ) => {
    const newAttendance = { ...attendance, [field]: value };
    if (field === "totalWorkingDays" || field === "daysPresent") {
      const percentage = (
        (newAttendance.daysPresent / newAttendance.totalWorkingDays) *
        100
      ).toFixed(1);
      newAttendance.percentage = percentage;
    }
    setAttendance(newAttendance);
  };

  const grandTotal = calculateGrandTotal();
  const examTotals = calculateExamTotals();
  const isPass = Number(grandTotal.percentage) >= 33;

  // Capitalize helper function
  const capitalizeWords = (str: string) => {
    if (!str) return "—";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="w-[210mm] outline-4 relative font-sans min-h-[297mm] mx-auto bg-white border border-black p-6 text-[12px] leading-tight break-after-page print:border-none ">
      {/* ================= SCHOOL HEADER TABLE ================= */}
      <table className="w-full border-collapse  border-8 border-red-700 border-b-0  z-10">
        <tbody>
          <tr>
            {/* Left Logo Placeholder */}
            <td className="w-24 align-middle border border-black p-2 text-center">
              <div className="h-20 relative flex items-center justify-center text-xs text-gray-400 ">
                <Image
                  className="object-contain"
                  src={"/logo.png"}
                  alt={student.name}
                  fill
                />
              </div>
            </td>

            {/* School Info */}
            <td className="border border-black p-3 text-center">
              <h1 className="text-3xl font-bold text-red-700 uppercase tracking-wide">
                ANGELS PUBLIC SCHOOL
              </h1>
              <p className="text-xs text-red-700 mt-1"></p>
              <p className="text-xs text-red-700">UDISE: 09031001737</p>
              <p className="text-xs text-red-700">
                MOHL. PREM NAGAR JALALABAD, DIST. BIJNOR, UTTAR PRADESH
              </p>
              <p className="text-xs text-red-700">
                +91-8273806070 | +91-8445533338
              </p>
            </td>

            {/* Right Logo Placeholder - Now Student Photo */}
            <td className="w-24 align-middle border border-black p-2 text-center">
              {/* {student.image_url ? (
                <img
                  src={student.image_url}
                  alt={student.name}
                  className="h-20 w-auto object-cover border border-black"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center text-xs text-gray-400 border border-black">
                  STUDENT PHOTO
                </div>
              )} */}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= REPORT TITLE ================= */}
      <table className="w-full border-collapse border-8 border-red-700 border-y-0  z-10">
        <tbody>
          <tr>
            <td className="border border-black p-2 text-center border-t-0">
              <h2 className="text-base font-bold uppercase tracking-wider">
                ACADEMIC RECORD
              </h2>
              <p className="text-xs text-gray-600">
                ACADEMIC SESSION: 2025–2026
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= STUDENT INFORMATION - THREE COLUMN LAYOUT ================= */}
      <table className="w-full border-collapse z-10 border-8 border-red-700 border-y-0">
        <tbody>
          <tr>
            {/* Column 1 - Personal Information */}
            <td className="border border-black p-2 align-top border-t-0">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-28">STUDENT NAME:</td>
                    <td className="py-1">
                      {capitalizeWords(student.name || "—")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">FATHER&apos;S NAME:</td>
                    <td className="py-1">
                      {capitalizeWords(student.fatherName || "—")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">MOTHER&apos;S NAME:</td>
                    <td className="py-1">
                      {capitalizeWords(student.motherName || "—")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">DATE OF BIRTH:</td>
                    <td className="py-1">
                      {student.dob
                        ? new Date(student.dob).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Column 2 - Academic Information */}
            <td className="border border-black p-2 align-top border-t-0">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-28">ROLL NUMBER:</td>
                    <td className="py-1">{student.rollnumber || "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">ADMISSION NO:</td>
                    <td className="py-1">{student.serialNumber || "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">CLASS:</td>
                    <td className="py-1 font-medium">
                      {capitalizeWords(student.class_name || "—")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Column 3 - Contact Information */}
            <td className="border border-black p-2 align-top border-t-0">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-28">MOBILE NUMBER:</td>
                    <td className="py-1">{student.mobileNumber || "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">BLOOD GROUP:</td>
                    <td className="py-1">
                      {student.bloodGroup
                        ? student.bloodGroup.toUpperCase()
                        : "—"}
                    </td>
                  </tr>
                  <tr className="items-start">
                    <td className="py-1 font-semibold align-top">ADDRESS:</td>
                    <td className="py-1 break-words">
                      {capitalizeWords(student.address || "—")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= SCHOLASTIC PERFORMANCE TABLE ================= */}
      <table className="w-full border-collapse text-xs z-10 border-8 border-red-700 border-y-0">
        <thead>
          <tr>
            <th className="border border-black p-2 text-left font-semibold border-t-0">
              SUBJECT
            </th>
            {examTypes.map((examType) => (
              <th
                key={examType}
                className="border border-black p-2 text-center font-semibold border-t-0"
                colSpan={2}
              >
                {EXAM_CONFIG[
                  examType as keyof typeof EXAM_CONFIG
                ].toUpperCase()}
              </th>
            ))}
            <th
              className="border border-black p-2 text-center font-semibold border-t-0"
              colSpan={2}
            >
              TOTAL
            </th>
          </tr>
          <tr>
            <th className="border border-black p-1 text-[10px] font-semibold text-left"></th>
            {examTypes.map((examType) => (
              <React.Fragment key={examType}>
                <th className="border border-black p-1 text-center text-[10px] font-semibold">
                  MAX
                </th>
                <th className="border border-black p-1 text-center text-[10px] font-semibold">
                  OBT
                </th>
              </React.Fragment>
            ))}
            <th className="border border-black p-1 text-center text-[10px] font-semibold">
              MAX
            </th>
            <th className="border border-black p-1 text-center text-[10px] font-semibold">
              OBT
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(student.subjectMarks).map(([key, subject]) => {
            const totals = calculateSubjectTotal(subject);
            return (
              <tr key={key}>
                <td className="border border-black p-2 font-medium">
                  {subject.subject_name.toUpperCase()}
                </td>
                {examTypes.map((examType) => (
                  <React.Fragment key={`${key}-${examType}`}>
                    <td className="border border-black p-2 text-center">
                      {subject.exam[examType]?.max ?? "-"}
                    </td>
                    <td className="border border-black p-2 text-center">
                      {subject.exam[examType]?.obtained ?? "-"}
                    </td>
                  </React.Fragment>
                ))}
                <td className="border border-black p-2 text-center">
                  {totals.totalMax}
                </td>
                <td className="border border-black p-2 text-center font-semibold">
                  {totals.totalObtained}
                </td>
              </tr>
            );
          })}

          {/* Grand Total Row */}
          <tr className="font-bold">
            <td className="border border-black p-2">GRAND TOTAL</td>
            {examTypes.map((examType) => (
              <React.Fragment key={examType}>
                <td className="border text-red-500 border-black p-2 text-center">
                  {examTotals[examType].max}
                </td>
                <td className="border border-black text-red-500 p-2 text-center">
                  {examTotals[examType].obtained}
                </td>
              </React.Fragment>
            ))}
            <td className="border border-black text-red-500 p-2 text-center">
              {grandTotal.totalMax}
            </td>
            <td className="border border-black text-red-500 p-2 text-center">
              {grandTotal.totalObtained}
            </td>
          </tr>

          {/* Percentage Row for Each Examination */}
          <tr>
            <td className="border border-black p-2 font-semibold text-xs">
              PERCENTAGE (%)
            </td>
            {examTypes.map((examType) => (
              <td
                key={`${examType}-percentage`}
                colSpan={2}
                className="border text-red-500 border-black p-2 text-right font-medium"
              >
                {examTotals[examType].percentage}%
              </td>
            ))}
            <td
              colSpan={2}
              className="border text-red-500 border-black p-2 text-right font-semibold"
            >
              {grandTotal.percentage}%
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= RESULT & ATTENDANCE TABLE ================= */}
      <table className="w-full border-collapse z-10 border-8 border-red-700 border-y-0">
        <tbody>
          <tr>
            <th className="border border-black p-2 text-left font-semibold w-1/2 border-t-0">
              RESULT SUMMARY
            </th>
            <th className="border border-black p-2 text-left font-semibold w-1/2 border-t-0">
              ATTENDANCE RECORD
              <button
                onClick={() => setIsEditingAttendance(!isEditingAttendance)}
                className="ml-2 text-[10px] border border-black px-2 py-0.5 rounded hover:bg-gray-50 print:hidden"
              >
                {isEditingAttendance ? "SAVE" : "EDIT"}
              </button>
            </th>
          </tr>
          <tr>
            <td className="border border-black p-2 align-top">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-36">
                      OVERALL PERCENTAGE:
                    </td>
                    <td className="py-1 text-red-500 font-bold">
                      {grandTotal.percentage}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">RESULT:</td>
                    <td className="py-1">
                      <span
                        className={`font-bold ${isPass ? "text-green-700" : "text-red-700"}`}
                      >
                        {isPass ? "PASS" : "FAIL"}
                      </span>
                      {!isPass && (
                        <span className="text-red-500 ml-2">(BELOW 33%)</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 font-semibold">POSITION:</td>
                    <td className="py-1 font-bold text-red-500">
                      {student.rank === 1
                        ? "1st"
                        : student.rank === 2
                          ? "2nd"
                          : student.rank === 3
                            ? "3rd"
                            : "Passed"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className="border border-black p-2 align-top">
              {isEditingAttendance ? (
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-1 font-semibold w-32">
                        TOTAL WORKING DAYS:
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          value={attendance.totalWorkingDays}
                          onChange={(e) =>
                            handleAttendanceChange(
                              "totalWorkingDays",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="border border-black rounded px-2 py-0.5 w-20 text-xs"
                          min="0"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">DAYS PRESENT:</td>
                      <td className="py-1">
                        <input
                          type="number"
                          value={attendance.daysPresent}
                          onChange={(e) =>
                            handleAttendanceChange(
                              "daysPresent",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="border border-black rounded px-2 py-0.5 w-20 text-xs"
                          min="0"
                          max={attendance.totalWorkingDays}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">ATTENDANCE %:</td>
                      <td className="py-1 font-bold">
                        {attendance.percentage}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-1 font-semibold w-32">
                        TOTAL WORKING DAYS:
                      </td>
                      <td className="py-1 text-red-500">
                        {attendance.totalWorkingDays}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">DAYS PRESENT:</td>
                      <td className="py-1 text-red-500">
                        {attendance.daysPresent}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">ATTENDANCE %:</td>
                      <td className="py-1 font-bold text-red-500">
                        {attendance.percentage}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= REMARKS TABLE ================= */}
      <table className="w-full border-collapse z-10 border-8 border-red-700 border-y-0">
        <tbody>
          <tr>
            <th className="border border-black p-2 text-left font-semibold border-t-0">
              TEACHER&apos;S REMARKS :{" "}
              <span className="text-xs italic text-gray-700">
                {remarks || "NO REMARKS PROVIDED"}
              </span>
              <button
                onClick={() => setIsEditingRemarks(!isEditingRemarks)}
                className="ml-2 text-[10px] border border-black px-2 py-0.5 rounded hover:bg-gray-50 print:hidden"
              >
                {isEditingRemarks ? "SAVE" : "EDIT"}
              </button>
            </th>
          </tr>
          {isEditingRemarks && (
            <tr>
              <td className="border border-black p-3 border-t-0">
                {
                  <div>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-black rounded p-2 text-xs"
                      rows={3}
                      placeholder="ENTER REMARKS ABOUT STUDENT'S PERFORMANCE..."
                    />
                    <div className="mt-2">
                      <p className="text-[10px] text-gray-500 mb-1">
                        QUICK SUGGESTIONS:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {[
                          "Excellent performance! Keep it up.",
                          "Good academic record. Needs to participate more.",
                          "Satisfactory performance. Can improve with effort.",
                          "Needs improvement in core subjects.",
                          "Outstanding achievement! A role model.",
                          "Regular and hardworking student.",
                          "Shows great improvement this term.",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setRemarks(suggestion)}
                            className="text-[10px] border border-black hover:bg-gray-50 px-2 py-0.5 rounded"
                          >
                            {suggestion.toUpperCase().substring(0, 30)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= SIGNATURE TABLE ================= */}
      <table className="w-full border-collapse z-10 border-8 border-red-700 border-t-0">
        <tbody>
          <tr>
            <td className="border border-black p-3 text-center w-1/3 border-t-0">
              <div className="border-t border-black pt-1 mt-4 w-32 mx-auto"></div>
              <p className="text-xs font-semibold mt-1">CLASS TEACHER</p>
              <p className="text-[10px] text-gray-500">(SIGNATURE & STAMP)</p>
            </td>
            <td className="border border-black p-3 text-center w-1/3 border-t-0">
              <div className="border-t border-black pt-1 mt-4 w-32 mx-auto"></div>
              <p className="text-xs font-semibold mt-1">PARENT/GUARDIAN</p>
              <p className="text-[10px] text-gray-500">(SIGNATURE)</p>
            </td>
            <td className="border border-black p-3 text-center w-1/3 border-t-0">
              <div className="border-t border-black pt-1 mt-4 w-32 mx-auto"></div>
              <p className="text-xs font-semibold mt-1">PRINCIPAL</p>
              <p className="text-[10px] text-gray-500">(MRS. HINA KAUSER)</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="inset-0 absolute flex items-center justify-center ">
        <div className="relative w-125 aspect-square opacity-10">
          <Image
            className="object-contain"
            src={"/logo.png"}
            alt={student.name}
            fill
          />
        </div>
      </div>
    </div>
  );
};

export default StudentReportCard;
