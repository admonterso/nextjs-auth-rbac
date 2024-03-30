import { z } from "zod";

export type Role = z.infer<typeof RoleSchema>;

export const RoleSchema = z.enum(["master", "admin", "viewer", "user"]);
