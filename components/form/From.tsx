"use client";

import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  FieldValues,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";

interface FormProps<TFormValues extends FieldValues> {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  schema: ZodTypeAny;
  defaultValues?: UseFormProps<TFormValues>["defaultValues"];
  formConfig?: UseFormProps<TFormValues>;
  className?: string;
}

export const Form = <TFormValues extends FieldValues>({
  onSubmit,
  children,
  schema,
  defaultValues,
  formConfig,
  className,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    ...formConfig,
    defaultValues,
    resolver: zodResolver(schema as any) as Resolver<TFormValues>,
  });

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={className}
    >
      {children(methods)}
    </form>
  );
};