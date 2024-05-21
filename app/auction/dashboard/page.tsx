import { getCachedUser } from "@/lib/queries/user";
import * as React from "react";

interface AdminDashboardPageProps {}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = async ({}) => {
  const user = await getCachedUser();

  return <div>AdminDashboardPage</div>;
};

export default AdminDashboardPage;
