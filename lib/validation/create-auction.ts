import * as z from "zod";

export const createAuctionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  duration: z.number().positive(),
});

//export infer typeof createAuctionSchema = z.infer<typeof createAuctionSchema>;

export type CreateAuctionInput = z.infer<typeof createAuctionSchema>;
