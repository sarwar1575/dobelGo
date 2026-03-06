"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/Button";
import Swal from "sweetalert2";
import { Siren } from "lucide-react";

interface EmergencyContact {
  id: string;
  driverId: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  address?: string;
  relation?: string;
  createdAt: string;
}

export default function EmergencyVerificationPage() {

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH CONTACTS
  // ======================

  const fetchPendingContacts = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/emergency-contact/pending",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (result.success) {
        setContacts(result.data);
      }

    } catch (error) {

      console.error(error);

      Swal.fire("Error", "Failed to fetch contacts", "error");

    } finally {
      setLoading(false);
    }
  };

  // ======================
  // VIEW CONTACT
  // ======================

  const handleView = (contact: EmergencyContact) => {

    Swal.fire({

      title: "Emergency Contact",

      html: `
        <div style="text-align:left">

        <p><b>Name:</b> ${contact.firstName} ${contact.lastName || ""}</p>

       

        <p><b>Phone:</b> ${contact.phone}</p>

        <p><b>Email:</b> ${contact.email || "N/A"}</p>

        <p><b>Relation:</b> ${contact.relation || "N/A"}</p>

        <p><b>Address:</b> ${contact.address || "N/A"}</p>

        </div>
      `,

      width: 500,
      confirmButtonText: "Close"

    });

  };

  // ======================
  // APPROVE / REJECT
  // ======================

  const handleVerify = async (id: string, action: "approve" | "reject") => {

    const isApprove = action === "approve";

    let rejectionReason = "";

    if (!isApprove) {

      const { value: reason, isConfirmed } = await Swal.fire({

        title: "Reject Contact?",
        input: "textarea",
        inputLabel: "Reason",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Reject",

        inputValidator: (value) => {
          if (!value) return "Please enter rejection reason";
          return null;
        }

      });

      if (!isConfirmed) return;

      rejectionReason = reason;

    } else {

      const confirm = await Swal.fire({

        title: "Approve Contact?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22C55E",
        confirmButtonText: "Approve"

      });

      if (!confirm.isConfirmed) return;

    }

    try {

      const res = await fetch(
        `http://localhost:3000/api/admin/emergency-contact/${id}/${action}`,
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
          `Contact ${isApprove ? "approved" : "rejected"} successfully`,
          "success"
        );

        fetchPendingContacts();

      } else {

        Swal.fire("Error", data.message || "Verification failed", "error");

      }

    } catch (error) {

      console.error(error);

      Swal.fire("Error", "Server error", "error");

    }
  };

  useEffect(() => {
    fetchPendingContacts();
  }, []);

  return (

    <div className="p-10 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <Siren size={28} className="text-rose-500" />

        <h1 className="text-2xl font-bold text-gray-900">
          Emergency Contact Verification
        </h1>

      </div>


      {/* TABLE */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">

            <tr>

              <th className="px-6 py-4">Contact Name</th>

              <th className="px-6 py-4">Relation</th>

              <th className="px-6 py-4">Phone</th>

              <th className="px-6 py-4 text-center">Action</th>

            </tr>

          </thead>

          <tbody className="divide-y">

            {loading ? (

              <tr>
                <td colSpan={4} className="text-center py-10">
                  Loading contacts...
                </td>
              </tr>

            ) : contacts.length === 0 ? (

              <tr>
                <td colSpan={4} className="text-center py-10">
                  No pending emergency contacts
                </td>
              </tr>

            ) : (

              contacts.map((contact) => (

                <tr key={contact.id} className="hover:bg-gray-50">

                  <td className="px-6 py-5">

                    <p className="font-semibold">
                      {contact.firstName} {contact.lastName}
                    </p>

                    <p className="text-xs text-gray-500">
                      Driver ID: {contact.driverId.slice(-8)}
                    </p>

                  </td>


                  <td className="px-6 py-5">

                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {contact.relation || "N/A"}
                    </span>

                  </td>


                  <td className="px-6 py-5">

                    {contact.phone}

                  </td>


                  <td className="px-6 py-5">

                    <div className="flex gap-2 justify-center">

                      <Button
                        onClick={() => handleView(contact)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                      >
                        View
                      </Button>

                      <Button
                        onClick={() => handleVerify(contact.id, "approve")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={() => handleVerify(contact.id, "reject")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
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