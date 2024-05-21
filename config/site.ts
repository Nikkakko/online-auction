import type { FooterItem, MainNavItem } from "@/types";

import { slugify } from "@/lib/utils";

export type SiteConfig = typeof siteConfig;

const links = {
  x: "https://twitter.com/sadmann17",
  github: "https://github.com/sadmann7/skateshop",
  githubAccount: "https://github.com/sadmann7",
  discord: "https://discord.com/users/sadmann7",
  calDotCom: "https://cal.com/sadmann7",
};

export const siteConfig = {
  name: "Auctioneer",
  description:
    "Auctioneer is a platform for buying and selling items. It is built with Next.js, TypeScript, and Tailwind CSS.",
  url: "https://skateshop.sadmn.com",
  ogImage: "https://skateshop.sadmn.com/opengraph-image.png",
  links,
  mainNav: [
    { label: "Home", href: "/" },
    { label: "Auctions", href: "/auctions" },
  ] satisfies MainNavItem[],
  footerNav: [] satisfies FooterItem[],
};
