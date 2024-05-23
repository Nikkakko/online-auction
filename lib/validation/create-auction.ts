import * as z from "zod";

export const createAuctionSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 character long",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 character long",
  }),

  // i get string from the input, use refines to convert it to a number
  startingPrice: z.coerce
    .number({
      required_error: "Starting price is required",
      invalid_type_error: "Starting price must be a number",
    })
    .int()
    .positive()
    .min(1, { message: "Starting price must be at least 1" }),

  images: z.array(z.string()).nonempty({
    message: "Please upload at least one image",
  }),
  instandBuyPrice: z.coerce.number().positive({
    message: "Instand Buy Price must be higher than the starting price",
  }),
  bidInterval: z.coerce.number().positive({
    message: "Bid Interval must be a positive number",
  }),
  endDate: z.date().min(new Date()),
});

//export infer typeof createAuctionSchema = z.infer<typeof createAuctionSchema>;

export type CreateAuctionInput = z.infer<typeof createAuctionSchema>;
