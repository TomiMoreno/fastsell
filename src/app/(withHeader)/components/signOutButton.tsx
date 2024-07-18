"use client";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export const SignOutButton = () => {
  const { mutate: logout } = api.auth.signOut.useMutation({
    onSuccess() {
      window.location.href = "/";
    },
    onError() {
      toast({
        title: "Error al cerrar sesión",
        variant: "destructive",
      });
    },
    onSettled() {
      void ctx.invalidate();
    },
  });
  const ctx = api.useUtils();
  const { toast } = useToast();
  return (
    <button
      onClick={() => {
        try {
          logout();
        } catch (error) {
          console.error("logout failed");
        }
      }}
    >
      Cerrar sesión
    </button>
  );
};
