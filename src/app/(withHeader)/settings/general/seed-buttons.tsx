"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const generateRandomHex = () => {
  const characters = "0123456789";
  return new Array(6)
    .fill(0)
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join("");
};

export default function SeedButtons() {
  const ctx = api.useUtils();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const addRandomData = api.seed.addRandomData.useMutation({
    onSuccess: () => {
      toast({
        title: "Contenido aleatorio agregado satisfactoriamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "No se pudo generar contenido aleatorio",
      });
    },
    onSettled: () => {
      void ctx.invalidate();
    },
  });

  return (
    <>
      <Button
        disabled={addRandomData.isPending}
        onClick={() => addRandomData.mutate()}
      >
        Agregar contenido aleatorio
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Eliminar el contenido actual</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <ClearDataForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ClearDataForm({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const randomCode = useRef(generateRandomHex());
  const ctx = api.useUtils();
  const clearCurrentData = api.seed.clearCurrentData.useMutation({
    onSuccess: () => {
      toast({
        title: "Contenido limpiado",
      });
      onClose();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "No se pudo eliminar el contenido",
      });
    },
    onSettled: () => {
      void ctx.invalidate();
    },
  });

  const getColor = (index: number) => {
    if (code[index] === undefined) return "";
    return code[index] === randomCode.current[index]
      ? "text-primary"
      : "text-destructive";
  };

  const isHalfEnded = code.slice(0, 3) === randomCode.current.slice(0, 3);

  return (
    <div className="space-y-5">
      <DialogHeader>
        <DialogTitle>Estas seguro?</DialogTitle>

        <DialogDescription>Esta acción no puede deshacerse.</DialogDescription>
        <DialogDescription>
          Para continuar escribe el siguiente código:{" "}
          <span className="text-base text-accent-foreground">
            {randomCode.current}
          </span>
        </DialogDescription>
      </DialogHeader>
      <InputOTP
        containerClassName="justify-center"
        value={code}
        onChange={setCode}
        maxLength={6}
      >
        <InputOTPGroup>
          <InputOTPSlot autoFocus className={getColor(0)} index={0} />
          <InputOTPSlot className={getColor(1)} index={1} />
          <InputOTPSlot className={getColor(2)} index={2} />
        </InputOTPGroup>
        <InputOTPSeparator className={isHalfEnded ? "text-primary" : ""} />
        <InputOTPGroup>
          <InputOTPSlot className={getColor(3)} index={3} />
          <InputOTPSlot className={getColor(4)} index={4} />
          <InputOTPSlot className={getColor(5)} index={5} />
        </InputOTPGroup>
      </InputOTP>
      <DialogFooter className="sm:justify-end">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="button"
          disabled={code !== randomCode.current || clearCurrentData.isPending}
          variant="destructive"
          onClick={() => clearCurrentData.mutate()}
        >
          Confirmar
        </Button>
      </DialogFooter>
    </div>
  );
}
