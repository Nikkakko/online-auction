"use server";

import { getCachedUser } from "@/lib/queries/user";
import {
  CreateAuctionInput,
  createAuctionSchema,
} from "@/lib/validation/create-auction";
import z from "zod";
import db from "@/lib/db";
import { getErrorMessage } from "@/lib/handle-error";

export const createAuction = async (input: CreateAuctionInput) => {
  const user = await getCachedUser();

  if (!user) {
    return {
      error: "User not found",
    };
  }

  const parsedValues = createAuctionSchema.safeParse(input);

  try {
  } catch (error) {
    return getErrorMessage(error);
  }
};
