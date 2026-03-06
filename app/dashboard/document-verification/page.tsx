"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import Swal from "sweetalert2";
import { FileText } from "lucide-react";

const getImageUrl = (path?: string) => {
  if (!path) return "/default-user.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("data:")) return path;
  if (path.includes("uploads/")) return `/${path.replace(/^\/+/, "")}`;
  return `/uploads/documents/${path}`;
};

interface Document {
  id: string;
  driverId: string;
  type: string;
  frontImage?: string;
  backImage?: string;
  createdAt: string;
}

export default function DocumentVerificationPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH DOCUMENTS
  // ======================
  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/documents/pending",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        setDocuments(result.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch documents", "error");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // VERIFY DOCUMENT
  // ======================
  const handleVerify = async (id: string, action: "approve" | "reject") => {
    const isApprove = action === "approve";
    let rejectionReason = "";

    if (!isApprove) {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Reject Document?",
        input: "textarea",
        inputLabel: "Reason for rejection",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Reject",
        inputValidator: (value) => {
          if (!value) return "Please enter rejection reason";
          return null;
        },
      });

      if (!isConfirmed) return;
      rejectionReason = reason;
    } else {
      const confirm = await Swal.fire({
        title: "Approve Document?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        confirmButtonText: "Approve",
      });

      if (!confirm.isConfirmed) return;
    }

    try {
      const statusValue = isApprove ? "approved" : "rejected";
      const res = await fetch(
        `http://localhost:3000/api/admin/documents/${id}/${statusValue}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: !isApprove ? JSON.stringify({ reason: rejectionReason }) : undefined,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        Swal.fire(
          "Success",
          `Document ${isApprove ? "approved" : "rejected"} successfully`,
          "success"
        );
        fetchPendingDocuments();
      } else {
        Swal.fire("Error", data.message || "Verification failed", "error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      Swal.fire("Error", "Server error", "error");
    }
  };

  // ======================
  // VIEW DOCUMENT
  // ======================
  const handleView = (doc: Document) => {
    Swal.fire({
      title: "Document Details",
      width: 700,
      html: `
        <div style="text-align:left;margin-bottom:20px">
          <p><b>Document Type:</b> ${doc.type}</p>
       
        </div>

        <div style="display:flex;gap:15px;justify-content:center">

          ${doc.frontImage
          ? `<div>
                    <p style="font-size:12px;margin-bottom:5px">Front</p>
                    <img src="${getImageUrl(
            doc.frontImage
          )}" style="width:260px;border-radius:8px"/>
                </div>`
          : ""
        }

          ${doc.backImage
          ? `<div>
                    <p style="font-size:12px;margin-bottom:5px">Back</p>
                    <img src="${getImageUrl(
            doc.backImage
          )}" style="width:260px;border-radius:8px"/>
                </div>`
          : ""
        }

        </div>

        <div style="margin-top:10px;font-size:13px;color:#555">
          Created: ${new Date(doc.createdAt).toLocaleDateString()}
        </div>
      `,
      confirmButtonText: "Close",
    });
  };

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <FileText size={28} className="text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          Document Verification
        </h1>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Document</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y">

            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  No pending documents
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">

                  <td className="px-6 py-5">
                    <p className="font-semibold">{doc.type}</p>
                    <p className="text-xs text-gray-500">
                      Driver ID: {doc.driverId.slice(-8)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {doc.frontImage ? (
                      <img
                        src={getImageUrl(doc.frontImage)}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No Image
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-gray-500 text-sm">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-2 justify-center">

                      <Button
                        onClick={() => handleView(doc)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg transition"
                      >
                        View
                      </Button>

                      <Button
                        onClick={() => handleVerify(doc.id, "approve")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition"
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={() => handleVerify(doc.id, "reject")}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg transition"
                      >
                        Reject
                      </Button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}