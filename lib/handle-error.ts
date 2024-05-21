import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

import * as z from "zod";

import { unknownError } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    return err.errors[0]?.message ?? unknownError;
  } else if (isClerkAPIResponseError(err)) {
    return err.errors[0]?.longMessage ?? unknownError;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  console.log({ errorMessage });

  return toast({
    title: "Error",
    description: errorMessage,
  });
}
