import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { GraduationCap, Phone, Mail, MapPin, User } from "lucide-react";

interface Student {
  id: string;
  admissionNumber: string;
  grade: string;
  dateOfBirth?: string | Date | null;
  gender?: string | null;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string | null;
  address?: string | null;
  status: string;
  enrollmentDate: string | Date;
  user: { name: string; email: string };
}

export function StudentProfileCard({ student }: { student: Student }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full text-xl font-bold text-white flex-shrink-0"
          style={{ backgroundColor: "#1A2340" }}
        >
          {student.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{student.user.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">{student.admissionNumber}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">{student.grade}</span>
            <StatusBadge status={student.status} />
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Details</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: User, label: "Gender", value: student.gender ?? "—" },
            { icon: GraduationCap, label: "Date of Birth", value: student.dateOfBirth ? formatDate(student.dateOfBirth) : "—" },
            { icon: GraduationCap, label: "Enrolled", value: formatDate(student.enrollmentDate) },
            { icon: MapPin, label: "Address", value: student.address ?? "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardian Details */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Guardian / Parent</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{student.guardianName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{student.guardianPhone}</span>
          </div>
          {student.guardianEmail && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{student.guardianEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
