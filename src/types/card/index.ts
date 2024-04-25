import { z } from "zod";
import { CustomDocumentReference } from "../firestore";

// extract the inferred type
export type FirestoreCardType = z.infer<typeof FirestoreCardSchema>;

export const FirestoreCardSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  balance: z
    .number({
      invalid_type_error: ".balance should be a number",
    })
    .optional(),
  active: z.boolean({
    invalid_type_error: ".active should be a boolean",
  }),
  payments: CustomDocumentReference.array(),
  owner: CustomDocumentReference,
  cardNumber: z.string(),
});
