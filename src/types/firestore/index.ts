import { z } from "zod";

const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum([
    "<",
    "<=",
    "==",
    "!=",
    ">=",
    ">",
    "array-contains",
    "in",
    "not-in",
    "array-contains-any",
  ]),
  value: z.any(),
});

export type FirestoreFilterType = z.infer<typeof FilterSchema>;
export const ListAllRequestSchema = z.object({
  pageSize: z.number(),
  collectionName: z.string(),
  pageToken: z.string().optional(),
  filters: z.array(FilterSchema).optional(),
});

export type ListAllRequestType = z.infer<typeof ListAllRequestSchema>;
