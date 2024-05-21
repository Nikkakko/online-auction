import * as React from "react";
import MainNav from "./main-nav";
import MobileNav from "./mobile-nav";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {}

const SiteHeader: React.FC<SiteHeaderProps> = ({}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* <ProductsCombobox /> */}
            {/* <CartSheet /> */}
            {/* <AuthDropdown user={user} /> */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
