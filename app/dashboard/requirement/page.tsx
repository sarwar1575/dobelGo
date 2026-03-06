"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import { CategoryForm } from "./form";
import Swal from "sweetalert2";

interface Category {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

const RequirementPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/categories",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/categories/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          fetchCategories();
        } else {
          const data = await res.json();
          Swal.fire("Error", data.message || "Failed to delete category", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Server error", "error");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your delivery requirements here
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-1.5 text-sm rounded-md shadow w-fit"
          >
            + Add Category
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <CategoryForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchCategories();
          }}
        />
      )}

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        {/* Table Header */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-700 text-lg">
            Categories List
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-100 text-sm text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {cat.name}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {cat.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
};

export default RequirementPage;