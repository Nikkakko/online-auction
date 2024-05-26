"use client";
import { slugify } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react";
import Link from "next/link";
import * as React from "react";

interface NotificationFeedProps {}

const NotificationFeed: React.FC<NotificationFeedProps> = ({}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const notifButtonRef = React.useRef(null);
  const { isSignedIn } = useUser();

  if (!isSignedIn) return null;
  return (
    <div>
      <NotificationIconButton
        ref={notifButtonRef}
        onClick={e => setIsVisible(!isVisible)}
      />
      <NotificationFeedPopover
        buttonRef={notifButtonRef}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        renderItem={({ item }) => {
          return (
            <Link
              href={`/auction/${slugify(item.data.itemName)}`}
              className="text-blue-500 bg-gray-100 p-8 rounded-lg block w-full text-center"
              onClick={() => setIsVisible(false)}
            >
              Someone outbid you on{" "}
              <span className="font-bold">{item.data.itemName}</span>
            </Link>
          );
        }}
      />
    </div>
  );
};

export default NotificationFeed;
