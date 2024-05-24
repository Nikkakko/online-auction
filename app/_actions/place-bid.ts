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

    if (parsedValues.data?.amount < 1) {
      return {
        error: "Amount must be higher than 0",
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
    if (auction.item.status !== "ACTIVE") {
      return {
        error: "Auction is not active",
      };
    }

    if (parsedValues.data.amount < auction.item.startingPrice) {
      return {
        error: "Amount must be higher than the starting price",
      };
    }

    if (
      parsedValues.data.amount <
      auction.item.currentBid + auction.item.bidInterval
    ) {
      return {
        error: "Amount must be higher than the current price + bid interval",
      };
    }

    //prevent bid if bid is < than highest bid
    const highestBid = await db.bid.findFirst({
      where: {
        auctionId: auction.id,
      },
      orderBy: {
        amount: "desc",
      },
    });

    if (!highestBid) {
      return {
        error: "No bids found",
      };
    }

    if (highestBid?.amount >= parsedValues.data.amount) {
      return {
        error: "Amount must be higher than the highest bid",
      };
    }

    if (auction.userId === user.id) {
      return {
        error: "You can't bid on your own auction",
      };
    }

    if (auction.endDate < new Date()) {
      return {
        error: "Auction has ended",
      };
    }

    // if bid is equal or highter than buy now price, end auction
    if (parsedValues.data.amount >= auction.item.instandBuyPrice) {
      await db.auction.update({
        where: {
          id: auction.id,
        },
        data: {
          endDate: new Date(),
          item: {
            update: {
              status: "COMPLETED",
            },
          },
        },
      });

      revalidatePath(`/auction/${auction.slug}`);

      return {
        success: true,
      };
    }

    await db.bid.create({
      data: {
        amount: parsedValues.data.amount,
        auctionId: auction.id,
        userId: user.id,
        userName:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0].emailAddress.split("@")[0],
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
