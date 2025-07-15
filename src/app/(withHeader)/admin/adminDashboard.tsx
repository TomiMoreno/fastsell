"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import OrganizationsTable from "./organizationsTable";
import UsersTable from "./usersTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "organizations">(
    "users",
  );

  const { data: users, isLoading: usersLoading } =
    api.admin.getAllUsers.useQuery();
  const { data: organizations, isLoading: orgsLoading } =
    api.admin.getAllOrganizations.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b">
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          onClick={() => setActiveTab("users")}
        >
          Users
        </Button>
        <Button
          variant={activeTab === "organizations" ? "default" : "ghost"}
          onClick={() => setActiveTab("organizations")}
        >
          Organizations
        </Button>
      </div>

      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable users={users} isLoading={usersLoading} />
          </CardContent>
        </Card>
      )}

      {activeTab === "organizations" && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Management</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationsTable
              organizations={organizations}
              isLoading={orgsLoading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
