import { useMediaQuery } from "@/hooks/use-media-query";
import { MainNavItem } from "@/types";
import { useSelectedLayoutSegment } from "next/navigation";
import * as React from "react";

interface MobileNavProps {
  items: MainNavItem[];
}

const MobileNav: React.FC<MobileNavProps> = ({ items }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) return null;

  return <div>MobileNav</div>;
};

export default MobileNav;
