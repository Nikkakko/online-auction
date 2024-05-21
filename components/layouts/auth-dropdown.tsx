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
    <>
      <SignedOut>
        <Button asChild>
          <SignInButton mode="modal" signUpForceRedirectUrl={"/"} />
        </Button>
      </SignedOut>
      <SignedIn>
        <CustomUserDropdown />
      </SignedIn>
    </>
  );
};

export default AuthDropdown;
