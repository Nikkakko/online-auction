import * as z from "zod";

export const placeBidSchema = z.object({
  auctionId: z.string(),
});

export type PlaceBid = z.infer<typeof placeBidSchema>;
