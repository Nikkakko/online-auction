import { Item, Auction, Bid } from "@prisma/client";

type ItemWithAutction = Auction & {
  item: Item;
  bids: Bid[];
};

export function isBidOver(item: ItemWithAutction) {
  return item.endDate < new Date();
}
