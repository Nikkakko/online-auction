import ItemCard from "@/components/ItemCard";
import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllAuctions } from "@/lib/getData";
import Image from "next/image";
import React from "react";

export default async function Home() {
  const allAuctions = await getAllAuctions();

  if (!allAuctions || allAuctions.length === 0) {
    return (
      <Shell variant="wrapper" className="py-12" as="main">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No auctions found</h2>
          <p className="mt-4 text-gray-600">
            There are currently no auctions available.
          </p>
        </div>
      </Shell>
    );
  }
  return (
    <Shell variant="wrapper" className="py-12" as="main">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {allAuctions.map(auction => (
          <React.Suspense
            key={auction.id}
            fallback={<Skeleton className="max-w-[350px] h-[200px]" />}
          >
            <ItemCard item={auction} />
          </React.Suspense>
        ))}
      </section>
    </Shell>
  );
}
