"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { placeBid } from "@/app/_actions/place-bid";
import { PlaceBid, placeBidSchema } from "@/lib/validation/place-bid";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface PlaceBidFormProps {
  auctionId: string;
}

const PlaceBidForm: React.FC<PlaceBidFormProps> = ({ auctionId }) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<PlaceBid>({
    resolver: zodResolver(placeBidSchema),
    defaultValues: {
      auctionId,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: PlaceBid) {
    startTransition(async () => {
      try {
        // 3. Submit your form to the server.
        const bid = await placeBid(values);
        if (bid?.error) {
          toast({
            title: "Error",
            description: bid.error,
          });

          form.reset();
          return;
        } else {
          toast({
            title: "Bid placed",
            description: "Your bid has been placed successfully.",
          });
        }
        form.reset();
      } catch (error: any) {
        // 4. Handle any errors.
        toast({
          title: "Error",
          description:
            "An error occurred while placing your bid. Please try again later.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Button type="submit" disabled={isPending}>
          Place bid
        </Button>
      </form>
    </Form>
  );
};

export default PlaceBidForm;
