import { z } from "zod";
import { CustomDocumentReference } from "../firestore";

// extract the inferred type
export type FirestoreHouseType = z.infer<typeof FirestoreHouseSchema>;

export const FirestoreHouseSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    invalid_type_error: ".name should be a string",
    required_error: ".name is required",
  }),
  address: z.string({
    invalid_type_error: ".address should be a string",
    required_error: ".address is required",
  }),
  entrees: CustomDocumentReference.array(),
  //   balance: z
  //     .number({
  //       invalid_type_error: ".balance should be a number",
  //     })
  //     .optional(),
  //   active: z.boolean({
  //     invalid_type_error: ".active should be a boolean",
  //   }),
  //   payments: CustomDocumentReference.array(),
  //   owner: CustomDocumentReference,
  //   cardNumber: z.string(),
});
