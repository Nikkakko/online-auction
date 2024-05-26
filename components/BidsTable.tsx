"use client";
import { Bid, Status } from "@prisma/client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTablePagination } from "./DataTablePagination";

interface BidsTableProps {
  bids: Bid[];
}

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

const BidsTable: React.FC<BidsTableProps> = ({ bids }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: bids,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    // sorting
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },

    initialState: {
      sorting: [
        {
          id: "createdAt",
          desc: true,
        },
      ],
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        cn(
                          header.column.columnDef.id === "amount" &&
                            "text-right"
                        )
                        // Amount header text-right
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default BidsTable;
