import CreateAuctionForm from "@/components/forms/CreateAuctionForm";
import { Shell } from "@/components/shell";
import * as React from "react";

interface CreateItemPageProps {}

const CreateItemPage: React.FC<CreateItemPageProps> = ({}) => {
  return (
    <Shell variant="wrapper" as="main" className="py-12">
      <CreateAuctionForm />
    </Shell>
  );
};

export default CreateItemPage;
