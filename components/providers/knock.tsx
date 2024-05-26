import { env } from "@/env";
import { useUser } from "@clerk/nextjs";
import { KnockFeedProvider, KnockProvider } from "@knocklabs/react";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";

const YourAppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  return (
    <KnockProvider
      apiKey={env.NEXT_PUBLIC_KNOCK_API_KEY}
      userId={user?.id ?? ""}
    >
      {/* Optionally, use the KnockFeedProvider to connect an in-app feed */}
      <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_ID}>
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
};

export default YourAppLayout;
