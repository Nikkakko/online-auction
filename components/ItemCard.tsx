import { Auction, Item, Bid } from "@prisma/client";
import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./ui/aspect-ratio";
import { isBidOver } from "@/utils/bids";

interface ItemCardProps {
  item: Auction & {
    item: Item;
    bids: Bid[];
  };
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        <CardTitle className="capitalize">{item.item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative w-full h-[200px] rounded-md overflow-hidden">
          <Image
            src={item.item.images[0]}
            fill
            className="object-cover "
            quality={100}
            priority
            alt={item.item.title}
          />
        </div>

        <CardDescription className="mt-4">
          {item.item.description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <span className="text-gray-600">
            {format(new Date(item.endDate), "dd.MM.yyyy")}
          </span>
          <Button asChild variant={isBidOver(item) ? "outline" : "default"}>
            <Link href={`/auction/${item.slug}`}>
              {isBidOver(item) ? "View Bid" : "Place Bid"}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
