import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Bus, MapPin, User as UserIcon, Truck } from "lucide-react";

interface Stop { order: number; name: string; time: string; }

export default async function TransportPage() {
  const session = await getServerSession(authOptions);
  const schoolId = session!.user.schoolId;

  const routes = await prisma.transportRoute.findMany({
    where: { schoolId },
    include: {
      assignments: {
        where: { endedAt: null },
        include: { student: { include: { user: { select: { name: true } } } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Transport" description={`${routes.length} route${routes.length !== 1 ? "s" : ""}`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => {
          const stops = (route.stops as Stop[]) ?? [];
          return (
            <div key={route.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* Route header */}
              <div className="p-5 border-b" style={{ backgroundColor: "#E8EAF0" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bus className="w-5 h-5" style={{ color: "#1A2340" }} />
                    <h3 className="font-semibold" style={{ color: "#1A2340" }}>{route.name}</h3>
                  </div>
                  <StatusBadge status={route.isActive ? "ACTIVE" : "INACTIVE"} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {route.driver && <div className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" />{route.driver}</div>}
                  {route.vehicle && <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" />{route.vehicle}</div>}
                  {route.plate && <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border">{route.plate}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x">
                {/* Stops */}
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stops ({stops.length})</h4>
                  <div className="space-y-2">
                    {stops.sort((a, b) => a.order - b.order).map((stop) => (
                      <div key={stop.order} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: "#1A2340" }}>
                          {stop.order}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{stop.name}</p>
                          <p className="text-[11px] text-gray-400">{stop.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learners */}
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Learners ({route.assignments.length})
                  </h4>
                  <div className="space-y-2">
                    {route.assignments.length === 0 ? (
                      <p className="text-xs text-gray-400">No learners assigned.</p>
                    ) : (
                      route.assignments.map((a) => (
                        <div key={a.id} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: "#C0392B" }}>
                            {a.student.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-xs font-medium text-gray-900 truncate">{a.student.user.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {routes.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">No transport routes configured.</div>
        )}
      </div>
    </div>
  );
}
