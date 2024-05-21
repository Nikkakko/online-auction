"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk, useUser } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CustomUserDropdownProps {}

const CustomUserDropdown: React.FC<CustomUserDropdownProps> = ({}) => {
  // Grab the `isLoaded` and `user` from useUser()
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const { signOut, openUserProfile } = useClerk();
  // Make sure that the useUser() hook has loaded
  if (!isLoaded) return <Skeleton className="w-20 h-8" />;
  // Make sure there is valid user data
  if (!user?.id) return null;

  const itemClass =
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none group select-none cursor-pointer"
        asChild
      >
        <div
          className="border flex items-center gap-2 py-1 px-2 rounded bg-secondary
          group-hover:shadow-md transition-shadow duration-200
        "
        >
          <Image
            alt={user?.primaryEmailAddress?.emailAddress!}
            src={user?.imageUrl}
            width={30}
            height={30}
            className="rounded-full"
          />

          <p className="text-sm font-semibold text-accent-foreground">
            {user?.firstName ||
              user?.primaryEmailAddress?.emailAddress!.split("@")[0]}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            openUserProfile();
          }}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auction/create" className={cn(itemClass)}>
            Create Auction
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auction/dashboard" className={cn(itemClass)}>
            My Auctions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut(() => router.push("/"))}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomUserDropdown;
