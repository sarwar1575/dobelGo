"use client";

import { z } from "zod";
import { Form } from "@/components/form/From";
import { Input, Label } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { showAlert } from "@/components/ui/alert/Alert";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["REQUIREMENT", "SERVICE"]),
  isActive: z.boolean().default(true),
});

type CategorySchema = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoryForm = ({ onSuccess, onCancel }: CategoryFormProps) => {

  const handleSubmit = async (data: CategorySchema) => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to add category");

      showAlert({
        type: "success",
        title: "Success",
        text: "Category added successfully!",
      });

      onSuccess();

    } catch (error: any) {
      showAlert({
        type: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95">

        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Category
        </h3>

        <Form<CategorySchema>
          schema={categorySchema}
          onSubmit={handleSubmit}
          defaultValues={{ type: "REQUIREMENT", isActive: true }}
          className="space-y-5"
        >
          {({ register, formState: { errors, isSubmitting } }) => (
            <>
              {/* Category Name */}
              <div className="space-y-1">
                <Label>Category Name</Label>
                <Input
                  placeholder="e.g. Electronics Delivery"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>

              {/* Type */}
              <div className="space-y-1">
                <Label>Type</Label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="REQUIREMENT">Requirement</option>
                  <option value="SERVICE">Service</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Save Category
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Form>

      </div>

    </div>
  );
};