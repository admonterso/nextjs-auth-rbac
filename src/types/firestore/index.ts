import { DocumentReference } from "firebase-admin/firestore";
import { z } from "zod";

export const CustomDocumentReference = z
  .object(
    {
      id: z.string({
        invalid_type_error: ".id should be a string",
        required_error: ".id is required",
      }),
      path: z.string({
        invalid_type_error: ".path should be a string",
        required_error: ".path is required",
      }),
    },
    {
      invalid_type_error: ".CustomDocumentReference should be an object",
      required_error: ".CustomDocumentReference is required",
    }
  )
  .refine(
    (x: object): x is DocumentReference => x instanceof DocumentReference
  );

export type FirestoreReferenceType = z.infer<typeof CustomDocumentReference>;

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
