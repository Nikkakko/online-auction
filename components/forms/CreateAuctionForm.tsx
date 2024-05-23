"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateAuctionInput,
  createAuctionSchema,
} from "@/lib/validation/create-auction";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { UploadDropzone } from "@/utils/uploadthing";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { createAuction } from "@/app/_actions/create-auction";
import { useRouter } from "next/navigation";

interface CreateAuctionFormProps {}

const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({}) => {
  // 1. Define your form.
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const form = useForm<CreateAuctionInput>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      images: [],
      instandBuyPrice: 0,
      bidInterval: 0,
      endDate: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateAuctionInput) {
    startTransition(async () => {
      try {
        await createAuction(values);
        form.reset();
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while creating the auction.",
        });
      }
    });
  }

  const { toast } = useToast();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 "
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. My first auction" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g. This is a description for my auction. "
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Price </FormLabel>
                <FormControl>
                  <Input type="number" {...field} step="0.01" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instandBuyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instant Buy Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bidInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bid Interval</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) =>
                        date.getTime() < new Date().getTime()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Choose the date when the auction will end.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "flex flex-col gap-2 ",
                    form.watch("images")?.length > 0
                      ? "border-primary-600"
                      : "border-muted-foreground"
                  )}
                >
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={res => {
                      //add new image to the list
                      const newImages = res.map(image => ({
                        fileUrl: image.url,
                        fileKey: image.key,
                      }));

                      field.onChange([
                        ...(field.value || []),
                        ...newImages.map(image => image.fileUrl),
                      ]);
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        title: "Error",
                        description: error.message,
                      });
                    }}
                  />
                  {form.watch("images") && (
                    <div className="flex space-x-2">
                      {form
                        .watch("images")
                        .map((image: string, index: number) => (
                          <Image
                            key={index}
                            src={image}
                            alt="Auction image"
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Enter images for your auction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreateAuctionForm;
