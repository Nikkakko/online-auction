"use server";

import { getCachedUser } from "@/lib/queries/user";
import {
  CreateAuctionInput,
  createAuctionSchema,
} from "@/lib/validation/create-auction";
import z from "zod";
import db from "@/lib/db";
import { getErrorMessage } from "@/lib/handle-error";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createAuction = async (input: CreateAuctionInput) => {
  const user = await getCachedUser();

  if (!user) {
    return {
      error: "User not found",
    };
  }

  const parsedValues = createAuctionSchema.safeParse(input);

  if (!parsedValues.success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    if (parsedValues.data.instandBuyPrice < parsedValues.data.startingPrice) {
      return {
        error: "Instand Buy Price must be higher than the starting price",
      };
    }

    const exists = await db.auction.findFirst({
      where: {
        slug: slugify(parsedValues.data.title),
      },
    });

    if (exists) {
      return {
        error: "Auction already exists",
      };
    }

    await db.auction.create({
      data: {
        slug: slugify(parsedValues.data.title),
        endDate: parsedValues.data.endDate,
        userId: user.id,

        item: {
          create: {
            title: parsedValues.data.title,
            description: parsedValues.data.description,
            images: parsedValues.data.images,
            instandBuyPrice: parsedValues.data.instandBuyPrice,
            startingPrice: parsedValues.data.startingPrice,
            bidInterval: parsedValues.data.bidInterval,
            userId: user.id,
          },
        },
      },
    });

    redirect("/");
  } catch (error) {
    return {
      error:
        "An error occurred while creating the auction. Please try again later.",
    };
  }
};
