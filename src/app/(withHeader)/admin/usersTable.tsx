"use client";

import { MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import AddUserToOrganizationForm from "./addUserToOrganizationForm";
import CreateUserForm from "./createUserForm";
import EditUserForm from "./editUserForm";

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  fullName: string;
  organizations: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

interface UsersTableProps {
  users: User[] | undefined;
  isLoading: boolean;
}

export default function UsersTable({ users, isLoading }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const utils = api.useUtils();

  const updateRoleMutation = api.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      void utils.admin.getAllUsers.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeUserMutation = api.admin.removeUserFromOrganization.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User removed from organization successfully",
      });
      void utils.admin.getAllUsers.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users?.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRoleChange = (
    userId: string,
    organizationId: string,
    newRole: "admin" | "user",
  ) => {
    updateRoleMutation.mutate({
      userId,
      organizationId,
      role: newRole,
    });
  };

  const handleRemoveUser = (userId: string, organizationId: string) => {
    removeUserMutation.mutate({
      userId,
      organizationId,
    });
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <CreateUserForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organizations</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.organizations.map((org) => (
                      <Badge
                        key={org.id}
                        variant={org.role === "admin" ? "default" : "secondary"}
                      >
                        {org.name} ({org.role})
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditUserForm user={user} />
                    <AddUserToOrganizationForm user={user} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.organizations.map((org) => (
                          <div key={org.id}>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(
                                  user.id,
                                  org.id,
                                  org.role === "admin" ? "user" : "admin",
                                )
                              }
                            >
                              {org.role === "admin"
                                ? "Remove Admin"
                                : "Make Admin"}{" "}
                              - {org.name}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveUser(user.id, org.id)}
                              className="text-red-600"
                            >
                              Remove from {org.name}
                            </DropdownMenuItem>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
