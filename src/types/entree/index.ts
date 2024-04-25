import { z } from "zod";

// extract the inferred type
export type FirestoreEntreeType = z.infer<typeof FirestoreEntreeSchema>;

export const FirestoreEntreeSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    invalid_type_error: ".name should be a string",
    required_error: ".name is required",
  }),
  houseId: z
    .string({
      invalid_type_error: ".houseId should be a string",
      required_error: ".houseId is required",
    })
    .min(1),

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
