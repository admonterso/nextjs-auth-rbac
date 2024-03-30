import { z } from "zod";

export const Z_Role = z.enum(["admin", "user"]);
