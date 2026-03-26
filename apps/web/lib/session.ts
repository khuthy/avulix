import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// Deduplicates getServerSession across the layout + page within a single render pass
export const getSession = cache(() => getServerSession(authOptions));
