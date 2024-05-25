import { placeBid } from "@/app/_actions/place-bid";
import { Shell } from "@/components/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { getDataBySlug } from "@/lib/getData";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { format } from "date-fns";
import PlaceBidForm from "@/components/forms/PlaceBidForm";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCachedUser } from "@/lib/queries/user";
import { env } from "@/env";
import BidsTable from "@/components/BidsTable";

interface AuctionSlugPageProps {
  params: {
    slug: string;
  };
}

const AuctionSlugPage: React.FC<AuctionSlugPageProps> = async ({ params }) => {
  const auction = await getDataBySlug(params.slug);
  const user = await getCachedUser();

  if (!auction) {
    return (
      <Shell variant="wrapper" className="py-12" as="main">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No auctions found</h2>
          <p className="mt-4 text-gray-600">
            There are currently no auctions available.
          </p>
          <Link
            href="/auction/create"
            className={cn(
              buttonVariants({
                variant: "default",
              })
            )}
          >
            Create one now
          </Link>
        </div>
      </Shell>
    );
  }

  const hasBids = auction?.bids.length > 0;

  const auctionInfo = [
    {
      id: "1",
      value: auction.item.startingPrice,
      label: "Starting price",
    },

    {
      id: "2",
      value: auction.item.bidInterval,
      label: "Bid interval",
    },
    {
      id: "3",
      value: auction.item.instandBuyPrice,
      label: "Buy now price",
    },

    {
      id: "4",
      //get highest bid
      value: auction.bids.reduce((acc, bid) => {
        if (bid.amount > acc) {
          return bid.amount;
        }
        return acc;
      }, 0),
      label: "Current bid",
    },
  ];

  return (
    <Shell variant="wrapper" className="py-12" as="main">
      <div className="grid grid-cols-1 grid-row-s1 lg:grid-cols-4 lg:grid-rows-2 gap-4 relative">
        <div className="lg:col-span-2 lg:row-span-2 col-span-1 row-span-1">
          <div className="relative w-full h-[400px] group  cursor-pointer rounded-xl overflow-hidden">
            <Image
              src={auction.item.images[0]}
              alt={auction.item.title}
              fill
              priority
              quality={100}
              className="object-cover"
            />
            {/* add overlay on group hover */}
            <ViewImages />
          </div>
        </div>

        {auction.item.images.slice(1, 5).map(image => (
          <div
            key={image}
            className={cn(
              "relative w-full group h-[250px] object-cover  rounded-xl overflow-hidden cursor-pointer col-span-1 row-span-1"
            )}
          >
            <Image
              key={image}
              src={image}
              fill
              alt={auction.item.title}
              className="object-cover "
              priority
              quality={100}
            />
            <ViewImages />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 ">
            <h1 className="text-3xl font-bold  capitalize">
              {auction.item.title}
            </h1>
            <div className="flex items-center justify-between w-full">
              <Badge variant={"secondary"} className="rounded-md">
                {auction.status}
              </Badge>
              <span className="text-gray-600">
                Ends on : {format(new Date(auction.endDate), "dd.MM.yyyy")}
              </span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 max-w-lg">
            {auctionInfo.map(info => (
              <div key={info.id} className="flex flex-col gap-2">
                <span className="text-primary">{info.label}</span>
                <span className="text-xl font-semibold text-foreground">
                  {formatPrice(info.value, {
                    minimumFractionDigits: 2,
                    minimumIntegerDigits: 1,
                  })}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col gap-2">
            <span className="text-primary">Description</span>
            <p className="text-gray-600">{auction.item.description}</p>
          </div>
        </div>
        {!user ? (
          /* sign in to  */
          <Card className="justify-center items-center flex flex-col">
            <CardHeader>
              <CardTitle>Sign in to place a bid</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                To place a bid, you need to sign in first.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={`/sign-in`}>
                <Button variant="default">Sign in</Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Place a bid</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaceBidForm auctionId={auction.id} />
            </CardContent>
            <CardFooter>
              {hasBids && (
                <BidsTable bids={auction.bids} status={auction.status} />
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </Shell>
  );
};

const ViewImages = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-20 flex items-center justify-center transition duration-300 ease-in-out " />
  );
};

export default AuctionSlugPage;
