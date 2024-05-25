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
import { formatDate } from "date-fns";
import { formatPrice } from "@/lib/utils";

interface BidsTableProps {
  bids: Bid[];
  status: Status;
}

const BidsTable: React.FC<BidsTableProps> = ({ bids, status }) => {
  const statusOptions: { value: Status; label: string }[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DELETED", label: "Deleted" },
  ];

  return (
    <Table>
      <TableCaption>Bids</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Bidder</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bids.map(bid => (
          <TableRow key={bid.id}>
            <TableCell className="font-medium">{bid.userName}</TableCell>
            <TableCell>
              {formatDate(bid.createdAt, "dd.MM.yyyy HH:mm")}
            </TableCell>

            <TableCell>
              {statusOptions.find(option => option.value === status)?.label}
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(bid.amount, {
                minimumFractionDigits: 2,
                minimumIntegerDigits: 1,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {formatPrice(
              bids.reduce((acc, bid) => acc + bid.amount, 0),
              {
                minimumFractionDigits: 2,
                minimumIntegerDigits: 1,
              }
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default BidsTable;
