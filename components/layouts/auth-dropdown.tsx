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
import { ArrowRightCircleIcon, ArrowRightToLine } from "lucide-react";

interface AuthDropdownProps {}

const AuthDropdown: React.FC<AuthDropdownProps> = () => {
  return (
    <>
      <SignedOut>
        <Button variant="default">
          <SignInButton mode="modal" signUpForceRedirectUrl={"/"} />
          <ArrowRightToLine className="ml-2 h-4 " />
        </Button>
      </SignedOut>
      <SignedIn>
        <CustomUserDropdown />
      </SignedIn>
    </>
  );
};

export default AuthDropdown;
