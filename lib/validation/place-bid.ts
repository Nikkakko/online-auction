import * as z from "zod";

export const placeBidSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "Amount must be a number",
    })
    .positive(),
  auctionId: z.string(),
});

export type PlaceBid = z.infer<typeof placeBidSchema>;
