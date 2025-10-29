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
import { Skeleton } from "@/components/ui/skeleton";

interface InfoItemSkeletonProps {
  icon: React.ReactNode;
  fullWidth?: boolean;
}

export default function StudentProfileSkeleton() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-2xl" />
              <section className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
                <Skeleton className="h-9 md:h-10 w-64 mx-auto md:mx-0 mb-2" />
                <Skeleton className="h-6 w-40 mx-auto md:mx-0" />
                <article className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  <Skeleton className="h-9 w-24 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                </article>
              </section>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <Skeleton className="h-8 w-56" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItemSkeleton icon={<User className="w-5 h-5" />} />
              <InfoItemSkeleton icon={<Calendar className="w-5 h-5" />} />
              <InfoItemSkeleton icon={<Hash className="w-5 h-5" />} />
              <InfoItemSkeleton icon={<Droplet className="w-5 h-5" />} />
              <InfoItemSkeleton icon={<Phone className="w-5 h-5" />} />
              <InfoItemSkeleton icon={<CreditCard className="w-5 h-5" />} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <InfoItemSkeleton
                icon={<MapPin className="w-5 h-5" />}
                fullWidth
              />
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-indigo-600" />
              <Skeleton className="h-8 w-40" />
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
          </div>

          {/* Academic History */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-green-600" />
              <Skeleton className="h-8 w-48" />
            </div>

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
                  {[1, 2, 3, 4].map((index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <Skeleton className="h-7 w-28 rounded-lg" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-6 w-24" />
                      </td>
                      <td className="py-4 px-4">
                        <Skeleton className="h-6 w-16" />
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

function InfoItemSkeleton({ icon, fullWidth = false }: InfoItemSkeletonProps) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <div className="flex items-start gap-3">
        <div className="mt-1 text-gray-500">{icon}</div>
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  );
}
