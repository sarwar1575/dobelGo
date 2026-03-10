"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import Swal from "sweetalert2";
import { Landmark } from "lucide-react";

const getImageUrl = (path?: string) => {
  if (!path) return "/default-user.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("data:")) return path;
  if (path.includes("uploads/")) return `/${path.replace(/^\/+/, "")}`;
  return `/uploads/bank/${path}`;
};

interface BankDetail {
  id: string;
  driverId: any;
  driver?: any;
  user?: any;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
  passbookImage?: string;
  rejectionReason?: string;
  createdAt: string;
}

const getDriverDisplay = (bank: any) => {
  const driverData = bank.driver || bank.user || (typeof bank.driverId === 'object' ? bank.driverId : null);

  if (driverData) {
    const name = `${driverData.firstName || driverData.userId?.firstName || ""} ${driverData.lastName || driverData.userId?.lastName || ""}`.trim();
    const id = driverData._id || driverData.id || (typeof bank.driverId === 'string' ? bank.driverId : "N/A");
    return { name: name || bank.accountHolderName || "Unknown Driver", id };
  }

  // Fallback if the backend does not populate driver information
  return {
    name: bank.accountHolderName || "Unknown Driver",
    id: typeof bank.driverId === 'string' ? bank.driverId : "N/A"
  };
};

export default function BankVerificationPage() {

  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH BANK DETAILS
  // =========================
  const fetchPendingBankDetails = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/bank/pending",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        setBankDetails(result.data);
      }

    } catch (error) {

      console.error("Failed to fetch bank details:", error);

      Swal.fire("Error", "Failed to fetch bank details", "error");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW BANK DETAILS
  // =========================
  const handleView = (bank: BankDetail) => {
    const driver = getDriverDisplay(bank);

    Swal.fire({

      title: "Bank Details",

      html: `
        <div style="text-align:left">
        
        <p><b> Name:</b> ${driver.name}</p>
        
        

        <p><b>Account Holder:</b> ${bank.accountHolderName}</p>

        <p><b>Account Number:</b> ${bank.accountNumber}</p>

        <p><b>IFSC Code:</b> ${bank.ifscCode}</p>

        <p><b>Bank Name:</b> ${bank.bankName || "N/A"}</p>

        ${bank.rejectionReason
          ? `<p><b>Rejection Reason:</b> ${bank.rejectionReason}</p>`
          : ""
        }

        ${bank.passbookImage
          ? `<img src="${getImageUrl(bank.passbookImage)}" style="width:100%;margin-top:10px;border-radius:10px"/>`
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
  const handleVerify = async (id: string, action: "approve" | "reject") => {

    const isApprove = action === "approve";

    let rejectionReason = "";

    if (!isApprove) {

      const { value: reason, isConfirmed } = await Swal.fire({

        title: "Reject Bank Account?",
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

        title: "Approve Bank Account?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        confirmButtonText: "Approve",

      });

      if (!confirm.isConfirmed) return;

    }

    try {

      const res = await fetch(
        `http://localhost:3000/api/admin/bank/${id}/${action}`,
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
          `Bank account ${isApprove ? "approved" : "rejected"} successfully`,
          "success"
        );

        fetchPendingBankDetails();

      } else {

        Swal.fire("Error", data.message || "Verification failed", "error");

      }

    } catch (error) {

      console.error("Verification error:", error);

      Swal.fire("Error", "Server error", "error");

    }
  };

  useEffect(() => {
    fetchPendingBankDetails();
  }, []);

  return (

    <div className="p-10 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <Landmark size={28} className="text-blue-500" />

        <h1 className="text-2xl font-bold text-gray-900">
          Bank Verification
        </h1>

      </div>


      {/* TABLE */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full text-left">

          {/* TABLE HEADER */}

          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">

            <tr>

              <th className="px-6 py-4">Driver</th>

              <th className="px-6 py-4">Account Holder</th>

              <th className="px-6 py-4">Bank</th>

              <th className="px-6 py-4 text-center">Action</th>

            </tr>

          </thead>


          {/* TABLE BODY */}

          <tbody className="divide-y">

            {loading ? (

              <tr>
                <td colSpan={4} className="text-center py-10">
                  Loading bank accounts...
                </td>
              </tr>

            ) : bankDetails.length === 0 ? (

              <tr>
                <td colSpan={4} className="text-center py-10">
                  No pending bank accounts
                </td>
              </tr>

            ) : (

              bankDetails.map((bank) => {
                const driver = getDriverDisplay(bank);

                return (
                  <tr key={bank.id} className="hover:bg-gray-50">

                    {/* DRIVER */}

                    <td className="px-6 py-5">

                      <p className="font-semibold">{driver.name}</p>

                      <p className="text-xs text-gray-500">
                        ID: {driver.id.slice(-8)}
                      </p>

                    </td>


                    {/* HOLDER */}

                    <td className="px-6 py-5">

                      <p className="font-medium">
                        {bank.accountHolderName}
                      </p>

                      <p className="text-xs text-gray-500 font-mono">
                        ****{bank.accountNumber.slice(-4)}
                      </p>

                    </td>


                    {/* BANK */}

                    <td className="px-6 py-5">

                      <p className="font-medium">
                        {bank.bankName || "N/A"}
                      </p>

                      <p className="text-xs text-gray-500">
                        IFSC: {bank.ifscCode}
                      </p>

                    </td>


                    {/* ACTION */}

                    <td className="px-6 py-5">

                      <div className="flex gap-2 justify-center">

                        <Button
                          onClick={() => handleView(bank)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                        >
                          View
                        </Button>

                        <Button
                          onClick={() => handleVerify(bank.id, "approve")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
                        >
                          Approve
                        </Button>

                        <Button
                          onClick={() => handleVerify(bank.id, "reject")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
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