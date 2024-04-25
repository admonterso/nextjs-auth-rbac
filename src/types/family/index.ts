import { z } from "zod";
import { CustomDocumentReference } from "../firestore";

// extract the inferred type
export type FirestoreFamilyType = z.infer<typeof FirestoreFamilySchema>;

export const FirestoreFamilySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  balance: z.number({
    invalid_type_error: "balance should be a number",
  }),
  nextPaymentDate: z.string({
    invalid_type_error: "next payment date should be a string",
  }),
  subscriptions: CustomDocumentReference.array(),
  payments: CustomDocumentReference.array(),
  members: CustomDocumentReference.array(),
});
