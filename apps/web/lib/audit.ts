import { prisma } from "./prisma";

interface LogActionParams {
  schoolId: string;
  userId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT" | "VIEW";
  entity: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAction(params: LogActionParams): Promise<void> {
  try {
    await prisma.auditLog.create({ data: params });
  } catch (err) {
    // Audit failures must never break primary flow
    console.error("[audit] Failed to write audit log:", err);
  }
}
