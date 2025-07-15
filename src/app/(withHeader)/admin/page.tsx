import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import { db } from "~/server/db";
import AdminDashboard from "./adminDashboard";

export default async function AdminPage() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");

  // Check if user is admin
  const userRole = await db.query.organizationUsersTable.findFirst({
    where: (t, { and, eq }) =>
      and(
        eq(t.userId, session.userId),
        eq(t.organizationId, session.organizationId),
      ),
  });

  if (!userRole || userRole.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}
