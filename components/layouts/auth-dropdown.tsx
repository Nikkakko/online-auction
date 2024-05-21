import * as React from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button, buttonVariants } from "../ui/button";
import type { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CustomUserDropdown from "../CustomUserDropdown";

interface AuthDropdownProps {}

const AuthDropdown: React.FC<AuthDropdownProps> = () => {
  return (
    <div>
      <SignedOut>
        <Button>
          <SignInButton mode="modal" signUpForceRedirectUrl={"/"} />
        </Button>
      </SignedOut>
      <SignedIn>
        {/* <div className="flex items-center gap-2">
          <Link
            href="/auction/create"
            className={cn(
              buttonVariants({
                variant: "link",
              })
            )}
          >
            Create Auction
          </Link>
          <UserButton />
        </div> */}
        <CustomUserDropdown />
      </SignedIn>
    </div>
  );
};

export default AuthDropdown;
