import { type Control } from "react-hook-form";
import { type z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

interface FieldProps {
  name: string;
  label: string;
  control: Control<z.infer<z.ZodTypeAny>>;
  type?: string;
  placeholder?: string;
  description?: string;
}

export default function Field({
  name,
  label,
  control,
  placeholder,
  description,
  type = "text",
  ...props
}: FieldProps) {
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
      {...props}
    />
  );
}
