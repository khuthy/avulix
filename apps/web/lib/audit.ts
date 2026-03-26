import { Prisma } from "@prisma/client";
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
    await prisma.auditLog.create({
      data: {
        ...params,
        oldValues: params.oldValues as Prisma.InputJsonValue | undefined,
        newValues: params.newValues as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (err) {
    // Audit failures must never break primary flow
    console.error("[audit] Failed to write audit log:", err);
  }
}
