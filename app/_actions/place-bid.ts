"use server";
import { getCachedUser } from "@/lib/queries/user";

import z from "zod";
import db from "@/lib/db";

import { getErrorMessage } from "@/lib/handle-error";
import { PlaceBid, placeBidSchema } from "@/lib/validation/place-bid";
import { revalidatePath } from "next/cache";

export const placeBid = async (values: PlaceBid) => {
  const user = await getCachedUser();

  if (!user) {
    return {
      error: "User not found",
    };
  }

  try {
    const parsedValues = placeBidSchema.safeParse(values);

    if (!parsedValues.success) {
      return {
        error: "Invalid input values",
      };
    }

    const auction = await db.auction.findFirst({
      where: {
        id: values.auctionId,
      },
      include: {
        item: true,
      },
    });

    if (!auction) {
      return {
        error: "Auction not found",
      };
    }

    //prevent bid if auction status is not active
    if (auction.status !== "ACTIVE" || auction.endDate < new Date()) {
      return {
        error: "Auction is not active",
      };
    }

    //prevent bid if user is the owner of the auction
    if (auction.userId === user.id) {
      return {
        error: "You can't bid on your own auction",
      };
    }

    const latestBidValue = auction.item.currentBid + auction.item.bidInterval;

    await db.bid.create({
      data: {
        auctionId: auction.id,
        userId: user.id,
        amount: latestBidValue,
        userName:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0].emailAddress.split("@")[0],
      },
    });

    await db.auction.update({
      where: {
        id: auction.id,
      },
      data: {
        item: {
          update: {
            currentBid: latestBidValue,
          },
        },
      },
    });

    revalidatePath(`/auction/${auction.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
};
