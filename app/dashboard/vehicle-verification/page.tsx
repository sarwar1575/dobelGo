"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import Swal from "sweetalert2";
import { Truck } from "lucide-react";

const getImageUrl = (path?: string) => {
  if (!path) return "/default-user.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("data:")) return path;
  if (path.includes("uploads/")) return `/${path.replace(/^\/+/, "")}`;
  return `/uploads/vehicles/${path}`;
};

interface Vehicle {
  driverId: string;
  vehicleName: string;
  vehicleType: string;
  vehicleNumber: string;
  engineNumber?: string;
  rcImage?: string;
  rejectionReason?: string;
}

export default function VehicleVerificationPage() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH VEHICLES
  // =========================
  const fetchPendingVehicles = async () => {
    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/drivers/vehicle/pending",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        setVehicles(result.data);
      }

    } catch (error) {

      console.error("Failed to fetch vehicles:", error);

      Swal.fire("Error", "Failed to fetch vehicles", "error");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW VEHICLE
  // =========================
  const handleView = (v: Vehicle) => {

    Swal.fire({

      title: "Vehicle Details",

      html: `
        <div style="text-align:left">

        <p><b>Vehicle Name:</b> ${v.vehicleName}</p>

        <p><b>Vehicle Type:</b> ${v.vehicleType}</p>

        <p><b>Vehicle Number:</b> ${v.vehicleNumber}</p>

        <p><b>Engine Number:</b> ${v.engineNumber || "N/A"}</p>

    

        ${v.rejectionReason
          ? `<p><b>Rejection Reason:</b> ${v.rejectionReason}</p>`
          : ""
        }

        ${v.rcImage
          ? `<img src="${getImageUrl(v.rcImage)}" style="width:100%;margin-top:10px;border-radius:10px"/>`
          : ""
        }

        </div>
      `,

      width: 500,
      confirmButtonText: "Close",

    });
  };

  // =========================
  // APPROVE / REJECT
  // =========================
  const handleVerify = async (driverId: string, action: "approve" | "reject") => {

    const isApprove = action === "approve";

    let rejectionReason = "";

    if (!isApprove) {

      const { value: reason, isConfirmed } = await Swal.fire({

        title: "Reject Vehicle?",
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

        title: "Approve Vehicle?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        confirmButtonText: "Approve",

      });

      if (!confirm.isConfirmed) return;

    }

    try {

      const res = await fetch(
        `http://localhost:3000/api/admin/driver/${driverId}/vehicle/${action}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
          `Vehicle ${isApprove ? "approved" : "rejected"} successfully`,
          "success"
        );

        fetchPendingVehicles();

      } else {

        Swal.fire("Error", data.message || "Verification failed", "error");

      }

    } catch (error) {

      console.error("Verification error:", error);

      Swal.fire("Error", "Server error", "error");

    }
  };

  useEffect(() => {
    fetchPendingVehicles();
  }, []);

  return (

    <div className="p-10 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <Truck size={28} className="text-yellow-500" />

        <h1 className="text-2xl font-bold text-gray-900">
          Vehicle Verification
        </h1>

      </div>


      {/* TABLE */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full text-left">

          {/* TABLE HEADER */}

          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">

            <tr>

              <th className="px-6 py-4">Vehicle</th>

              <th className="px-6 py-4">Specifications</th>

              <th className="px-6 py-4">Vehicle Number</th>

              <th className="px-6 py-4 text-center">Action</th>

            </tr>

          </thead>


          {/* TABLE BODY */}

          <tbody className="divide-y">

            {loading ? (

              <tr>
                <td colSpan={4} className="text-center py-10">
                  Loading vehicles...
                </td>
              </tr>

            ) : vehicles.length === 0 ? (

              <tr>
                <td colSpan={4} className="text-center py-10">
                  No pending vehicles
                </td>
              </tr>

            ) : (

              vehicles.map((v, i) => (

                <tr key={i} className="hover:bg-gray-50">

                  {/* VEHICLE */}

                  <td className="px-6 py-5">

                    <p className="font-semibold">{v.vehicleName}</p>

                    <p className="text-xs text-gray-500">
                      Driver ID: {v.driverId.slice(-8)}
                    </p>

                  </td>


                  {/* SPECS */}

                  <td className="px-6 py-5">

                    <p className="font-medium">{v.vehicleType}</p>

                    <p className="text-xs text-gray-500">
                      Engine: {v.engineNumber || "N/A"}
                    </p>

                  </td>


                  {/* NUMBER */}

                  <td className="px-6 py-5">

                    <span className="bg-gray-900 text-white px-3 py-1 rounded font-mono text-sm">
                      {v.vehicleNumber}
                    </span>

                  </td>


                  {/* ACTION */}

                  <td className="px-6 py-5">

                    <div className="flex gap-2 justify-center">

                      <Button
                        onClick={() => handleView(v)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                      >
                        View
                      </Button>

                      <Button
                        onClick={() => handleVerify(v.driverId, "approve")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={() => handleVerify(v.driverId, "reject")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
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