import type { FieldValues, Path, Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import type { ComponentProps } from "react";

interface FieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: ComponentProps<typeof Input>["type"];
  placeholder?: string;
  description?: string;
}

export default function Field<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  description,
  type = "text",
}: FieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
