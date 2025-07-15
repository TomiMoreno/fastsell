"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

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

interface AddUserToOrganizationFormProps {
  user: User;
}

export default function AddUserToOrganizationForm({
  user,
}: AddUserToOrganizationFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    organizationId: "",
    role: "user" as "admin" | "user",
  });

  const { toast } = useToast();
  const utils = api.useUtils();

  const { data: organizations } = api.admin.getAllOrganizations.useQuery();

  const addUserToOrganizationMutation =
    api.admin.addExistingUserToOrganization.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "User added to organization successfully",
        });
        setOpen(false);
        setFormData({
          organizationId: "",
          role: "user",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationId) {
      toast({
        title: "Error",
        description: "Please select an organization",
        variant: "destructive",
      });
      return;
    }
    addUserToOrganizationMutation.mutate({
      userId: user.id,
      ...formData,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter out organizations the user is already a member of
  const availableOrganizations = organizations?.filter(
    (org) => !user.organizations.some((userOrg) => userOrg.id === org.id),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User to Organization</DialogTitle>
          <DialogDescription>
            Add {user.fullName} to an organization they&apos;re not already a
            member of.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Select
              value={formData.organizationId}
              onValueChange={(value) =>
                handleInputChange("organizationId", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {availableOrganizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableOrganizations?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                User is already a member of all organizations.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "admin" | "user") =>
                handleInputChange("role", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                addUserToOrganizationMutation.isPending ||
                availableOrganizations?.length === 0
              }
            >
              {addUserToOrganizationMutation.isPending
                ? "Adding..."
                : "Add to Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
