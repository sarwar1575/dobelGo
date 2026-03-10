"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import Swal from "sweetalert2";
import { Users } from "lucide-react";
import { Driver, getImageUrl, handleView } from "./view";

export default function DriverVerificationPage() {

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH DRIVERS
  // ======================
  const fetchPendingDrivers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/drivers/pending",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        setDrivers(result.data);
      }

    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      Swal.fire("Error", "Failed to fetch drivers", "error");

    } finally {
      setLoading(false);
    }
  };

  // ======================
  // APPROVE / REJECT
  // ======================
  const handleVerify = async (id: string, action: "approve" | "reject") => {

    const isApprove = action === "approve";
    let rejectionReason = "";

    if (!isApprove) {

      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Reject Driver?",
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
        title: "Approve Driver?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        confirmButtonText: "Approve",
      });

      if (!confirm.isConfirmed) return;
    }

    try {

      const res = await fetch(
        `http://localhost:3000/api/admin/driver/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: !isApprove
            ? JSON.stringify({ reason: rejectionReason })
            : undefined,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {

        Swal.fire(
          "Success",
          `Driver ${isApprove ? "approved" : "rejected"} successfully`,
          "success"
        );

        fetchPendingDrivers();

      } else {

        Swal.fire("Error", data.message || "Verification failed", "error");
      }

    } catch (error) {

      console.error("Verification error:", error);
      Swal.fire("Error", "Server error", "error");
    }
  };

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Users size={28} className="text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          Driver Verification
        </h1>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full text-left">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y">

            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  Loading drivers...
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10">
                  No pending drivers
                </td>
              </tr>
            ) : (
              drivers.map((driver) => {

                const phone =
                  driver.phoneNumber ||
                  driver.userId?.phoneNumber ||
                  driver.user?.phoneNumber ||
                  driver.userId?.phone ||
                  driver.user?.phone ||
                  "N/A";

                const imgUrl = getImageUrl(driver.profileImage);

                const firstName =
                  driver.firstName || driver.userId?.firstName || "";

                const lastName =
                  driver.lastName || driver.userId?.lastName || "";

                return (
                  <tr key={driver.id} className="hover:bg-gray-50">

                    {/* DRIVER */}
                    <td className="px-6 py-5 flex items-center gap-3">

                      <img
                        src={imgUrl}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-user.png";
                        }}
                      />

                      <div>
                        <p className="font-semibold">
                          {firstName} {lastName}
                        </p>

                        <p className="text-xs text-gray-500">
                          ID: {driver.id.slice(-8)}
                        </p>
                      </div>

                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-5">

                      <p className="font-medium">{phone}</p>

                      <p className="text-xs text-gray-500">
                        Alt: {driver.alternatePhone || "N/A"}
                      </p>

                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5">
                      {new Date(driver.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5">

                      <div className="flex gap-2 justify-center">

                        <Button
                          onClick={() => handleView(driver)}
                          className="bg-indigo-400 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg transition"
                        >
                          View
                        </Button>

                        <Button
                          onClick={() => handleVerify(driver.id, "approve")}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition"
                        >
                          Approve
                        </Button>

                        <Button
                          onClick={() => handleVerify(driver.id, "reject")}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg transition"
                        >
                          Reject
                        </Button>

                      </div>

                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}