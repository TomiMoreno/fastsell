"use client";

import { Search, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import CreateOrganizationForm from "./createOrganizationForm";

interface Organization {
  id: string;
  name: string;
  logo: string;
  createdAt: Date;
  users: Array<{
    id: string;
    name: string;
    lastName: string;
    email: string;
    fullName: string;
    role: string;
  }>;
}

interface OrganizationsTableProps {
  organizations: Organization[] | undefined;
  isLoading: boolean;
}

export default function OrganizationsTable({
  organizations,
  isLoading,
}: OrganizationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrganizations = organizations?.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <div>Loading organizations...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <CreateOrganizationForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Admins</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations?.map((org) => {
              const admins = org.users.filter((user) => user.role === "admin");

              return (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{org.users.length} members</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {org.users.slice(0, 3).map((user) => (
                        <Badge
                          key={user.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {user.fullName}
                        </Badge>
                      ))}
                      {org.users.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{org.users.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {admins.map((admin) => (
                        <Badge
                          key={admin.id}
                          variant="default"
                          className="text-xs"
                        >
                          {admin.fullName}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
