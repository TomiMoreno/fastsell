import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import type { useToast } from "~/components/ui/use-toast";
import type { AppRouter } from "~/server/api/root";

export const toastZodErrorsLink: (
  toast: ReturnType<typeof useToast>["toast"],
) => TRPCLink<AppRouter> = (toast) => () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          observer.error(err);
          toast({
            variant: "destructive",
            title: err?.data?.zodError?.fieldErrors
              ? Object.values(err.data.zodError.fieldErrors)
                  .filter((e) => e)
                  .flat()
                  .join(", ")
              : "No se pudo realizar la acción, intentelo denuevo mas tarde",
          });
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};
