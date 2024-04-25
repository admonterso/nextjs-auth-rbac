import { z } from "zod";

export type FirestoreTerminalType = z.infer<typeof FirestoreTerminalSchema>;

export const FirestoreTerminalSchema = z.object({
  name: z.string({
    required_error: "Name of terminal is required",
    invalid_type_error: "Name of terminal must be a string",
  }),
  entreeId: z.string({
    required_error: "Entree ID is required",
    invalid_type_error: "Entree ID must be a string",
  }),
  paymentDate: z.coerce.date({
    required_error: "Payment date is required",
    invalid_type_error: "Payment date must be a date",
  }),
  balance: z
    .number({
      required_error: "Balance is required",
      invalid_type_error: "Balance must be a number",
    })
    .optional(),
  pricing: z.object(
    {
      monthly: z.number({
        required_error: "Monthly pricing is required",
        invalid_type_error: "Monthly pricing must be a number",
      }),
      ride: z.number({
        required_error: "Ride pricing is required",
        invalid_type_error: "Ride pricing must be a number",
      }),
    },
    {
      required_error: "Pricing is required",
      invalid_type_error: "Pricing must be an object",
    }
  ),
});
