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

      {/* <nav className="flex items-center space-x-4">
        {items.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center space-x-2"
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav> */}
    </div>
  );
};

export default MainNav;
