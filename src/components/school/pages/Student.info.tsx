"use client";

import React from "react";
import {
  User,
  Phone,
  Calendar,
  Droplet,
  MapPin,
  Users,
  BookOpen,
  Hash,
  CreditCard,
} from "lucide-react";
import { PopulatedStudent } from "@/server/DB/models/student";
import { calculateAge, formatDateFrontend } from "@/lib/utils";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  fullWidth?: boolean;
}

export default function StudentProfile({
  student,
}: {
  student: PopulatedStudent;
}) {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <img
                src={student.image_url}
                alt={student.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              <section className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {student.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Serial No: {student.serialNumber}
                </p>
                <article className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Roll: {student.classes[0]?.rollnumber}
                  </span>
                  <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Droplet className="w-4 h-4" />
                    {student.bloodGroup}
                  </span>
                </article>
              </section>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="Full Name"
                value={student.name}
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Date of Birth"
                value={formatDateFrontend(student.dob)}
              />
              <InfoItem
                icon={<Hash className="w-5 h-5" />}
                label="Age"
                value={`${calculateAge(student.dob)} years`}
              />
              <InfoItem
                icon={<Droplet className="w-5 h-5" />}
                label="Blood Group"
                value={student.bloodGroup!}
              />
              <InfoItem
                icon={<Phone className="w-5 h-5" />}
                label="Mobile Number"
                value={`+91 ${student.mobileNumber}`}
              />
              <InfoItem
                icon={<CreditCard className="w-5 h-5" />}
                label="Aadhaar Number"
                value={String(student.adhaarNumber)}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <InfoItem
                icon={<MapPin className="w-5 h-5" />}
                label="Address"
                value={student.address}
                fullWidth
              />
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              Family Details
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Father&apos;s Name</p>
                <p className="text-lg font-semibold text-gray-800">
                  {student.fatherName}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Mother&apos;s Name</p>
                <p className="text-lg font-semibold text-gray-800">
                  {student.motherName}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              Academic History
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Session
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Class
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Roll Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.classes.map((classItem, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                          {classItem.session_id.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {classItem.class_id.class_name}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {classItem.rollnumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, fullWidth = false }: InfoItemProps) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <div className="flex items-start gap-3">
        <div className="mt-1 text-gray-500">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-base font-semibold text-gray-800 wrap-break-word">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
