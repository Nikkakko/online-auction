import Link from "next/link";
import * as React from "react";
import { Icons } from "../icons";
import { MainNavItem } from "@/types";
import { siteConfig } from "@/config/site";

interface MainNavProps {
  items: MainNavItem[];
}

const MainNav: React.FC<MainNavProps> = ({ items }) => {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link href="/" className="hidden items-center space-x-2 lg:flex">
        <Icons.logo className="size-6" aria-hidden="true" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
        <span className="sr-only">Home</span>
      </Link>
    </div>
  );
};

export default MainNav;
