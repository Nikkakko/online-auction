"use client";

import { Bid } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "date-fns";
import { formatPrice } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Bid>[] = [
  {
    id: "userName",
    accessorKey: "userName",
    header: "Bidder",
    cell: ({ row }) => <div>{row.getValue("userName")}</div>,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("createdAt"), "dd.MM.yyyy HH:mm")}</div>
    ),
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">
        {formatPrice(row.getValue("amount"), {
          minimumFractionDigits: 2,
          minimumIntegerDigits: 1,
        })}
      </div>
    ),
  },
];
