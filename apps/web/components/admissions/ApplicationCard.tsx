import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { GraduationCap, Phone, Mail, Calendar } from "lucide-react";

interface Application {
  id: string;
  applicantName: string;
  grade: string;
  gender?: string | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: string;
  submittedAt: string | Date;
  previousSchool?: string | null;
}

export function ApplicationCard({ application, onClick }: { application: Application; onClick?: () => void }) {
  return (
    <div
      className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{application.applicantName}</p>
          <div className="flex items-center gap-2 mt-1">
            <GraduationCap className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{application.grade}</span>
            {application.gender && <span className="text-xs text-gray-400">· {application.gender}</span>}
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="w-3 h-3" />
          <span>{application.parentName} — {application.parentEmail}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone className="w-3 h-3" />
          <span>{application.parentPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Submitted {formatDate(application.submittedAt)}</span>
        </div>
      </div>
    </div>
  );
}
