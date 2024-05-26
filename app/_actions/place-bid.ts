"use server";
import { getCachedUser } from "@/lib/queries/user";
import { Knock } from "@knocklabs/node";
import { env } from "@/env";

import z from "zod";
import db from "@/lib/db";

import { getErrorMessage } from "@/lib/handle-error";
import { PlaceBid, placeBidSchema } from "@/lib/validation/place-bid";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

const knock = new Knock(env.KNOCK_SECRET_KEY);

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

    //TODO: send notification to everyone who has bid on the auction

    const currentBids = await db.bid.findMany({
      where: {
        auctionId: auction.id,
      },

      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const recipients: {
      id: string;
      name: string;
      email: string;
    }[] = [];

    const recipientEmails = new Map<string, string>();
    const userIds = currentBids.map(bid => bid.userId);

    // get each user email with userIds from clerkClient
    const userPromises = userIds.map(async userId => {
      const userResponse = await clerkClient.users.getUser(userId);
      recipientEmails.set(userId, userResponse.emailAddresses[0].emailAddress);
    });

    await Promise.all(userPromises);

    for (const { userId, userName } of currentBids) {
      if (
        userId !== user.id &&
        !recipients.some(recipient => recipient.id === userId)
      ) {
        recipients.push({
          id: userId,
          name: userName,
          email: recipientEmails.get(userId) || "",
        });
      }
    }

    if (recipients.length > 0) {
      await knock.workflows.trigger("user-placed-bid", {
        actor: {
          id: user.id,
          name: user.fullName ?? "Anonymous",
          email: user.emailAddresses[0].emailAddress,
          collection: "users",
        },
        recipients,
        data: {
          auctionId: auction.id,
          bidAmount: latestBidValue,
          itemName: auction.item.title,
        },
      });
    }

    revalidatePath(`/auction/${auction.slug}`);

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
};
