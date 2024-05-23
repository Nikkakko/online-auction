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
import { ArrowRightCircleIcon, ArrowRightSquareIcon } from "lucide-react";

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

  const dropdownItems = [
    {
      name: "Profile",
      onClick: () => openUserProfile(),
    },
    {
      name: "Create Auction",
      href: "/auction/create",
    },
    {
      name: "My Auctions",
      href: "/auction/dashboard",
    },
    {
      name: "Sign Out",
      onClick: () => signOut(() => router.push("/")),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none group select-none cursor-pointer"
        asChild
      >
        <button
          className="border flex items-center gap-2 py-1 px-2 rounded-md bg-secondary
          group-hover:shadow-md transition-shadow duration-200"
          type="button"
        >
          {/* If the user has an image, display it. Otherwise, display their initials */}
          {!user?.imageUrl ? (
            <div className="w-6 h-6 bg-background text-accent-background flex items-center justify-center rounded-full">
              {user?.firstName?.charAt(0) ||
                user?.primaryEmailAddress?.emailAddress!.charAt(0)}
            </div>
          ) : (
            <Image
              alt={user?.primaryEmailAddress?.emailAddress!}
              src={user?.imageUrl}
              width={30}
              height={30}
              className="rounded-full"
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>
          {/* render image */}
          <div className="flex items-center gap-2">
            <Image
              alt={user?.primaryEmailAddress?.emailAddress!}
              src={user?.imageUrl}
              width={30}
              height={30}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-secondary-foreground">
                {user?.firstName ||
                  user?.primaryEmailAddress?.emailAddress!.split("@")[0]}
              </p>
              <p className="text-xs text-accent-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {dropdownItems.map((item, index) => {
          if (item.href) {
            return (
              <DropdownMenuItem key={index} asChild>
                <Link href={item.href} className={cn(itemClass)}>
                  {item.name}
                </Link>
              </DropdownMenuItem>
            );
          } else {
            return (
              <DropdownMenuItem key={index} onClick={item.onClick}>
                {item.name === "Sign Out" && (
                  <ArrowRightSquareIcon className="mr-2 h-5 w-auto opacity-80" />
                )}
                {item.name}
              </DropdownMenuItem>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomUserDropdown;
