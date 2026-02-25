"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input/Input";

// --- Tab Card Component ---
const DashboardTab = ({
  label,
  value,
  title,
  color,
  isActive,
  onClick,
}: {
  label: string;
  value: string;
  title: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 text-left p-5 rounded-2xl transition-all border ${
      isActive
        ? "bg-white shadow-md"
        : "bg-gray-100 border-transparent opacity-70 hover:opacity-100"
    }`}
  >
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </span>
    <h3 className="text-sm font-semibold text-gray-700 mt-1">{title}</h3>
    <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
  </button>
);

type TableRow = string[];

interface TableConfig {
  heading: string;
  columns: string[];
  rows: TableRow[];
}

export default function DashboardPage() {
  // 1. State to track active tab
  const [activeTab, setActiveTab] = useState<
    "Fleet" | "Drivers" | "Service" | "Issues" | "Finance"
  >("Fleet");

  // 2. Search state
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Mock Data for Tables (with rows to enable real searching)
  const tableContent: Record<
    "Fleet" | "Drivers" | "Service" | "Issues" | "Finance",
    TableConfig
  > = {
    Fleet: {
      heading: "All Rides History",
      columns: ["Ride ID", "Customer", "Driver", "Status", "Amount"],
      rows: [
        ["#F-1021", "Rahul Sharma", "Driver 21", "Completed", "₹320"],
        ["#F-1022", "Anita Singh", "Driver 14", "Ongoing", "₹210"],
        ["#F-1023", "John Doe", "Driver 03", "Cancelled", "₹0"],
        ["#F-1024", "Priya Verma", "Driver 09", "Completed", "₹450"],
        ["#F-1025", "Arjun Mehta", "Driver 18", "Completed", "₹380"],
      ],
    },
    Drivers: {
      heading: "Active Drivers List",
      columns: ["Driver ID", "Name", "Vehicle", "Rating", "Status"],
      rows: [
        ["#D-501", "Rahul Kumar", "WagonR", "4.8", "Online"],
        ["#D-502", "Sneha Rao", "Swift", "4.9", "On Trip"],
        ["#D-503", "Imran Ali", "i20", "4.6", "Offline"],
        ["#D-504", "Neha Gupta", "Baleno", "4.7", "Online"],
        ["#D-505", "Aman Singh", "Dzire", "4.5", "Online"],
      ],
    },
    Service: {
      heading: "Pending Service Requests",
      columns: ["Ticket ID", "Subject", "Priority", "Time"],
      rows: [
        ["#S-9001", "App Crashing", "High", "10:24 AM"],
        ["#S-9002", "Payment Issue", "Medium", "09:10 AM"],
        ["#S-9003", "Driver Not Arrived", "High", "Yesterday"],
        ["#S-9004", "Refund Request", "Low", "2 days ago"],
        ["#S-9005", "Profile Update", "Low", "1 week ago"],
      ],
    },
    Issues: {
      heading: "Reported Issues",
      columns: ["Issue ID", "User", "Type", "Resolution"],
      rows: [
        ["#I-3001", "Rahul Sharma", "Safety", "In Progress"],
        ["#I-3002", "Anita Singh", "Payment", "Resolved"],
        ["#I-3003", "John Doe", "Service", "Pending"],
        ["#I-3004", "Priya Verma", "Behaviour", "In Review"],
        ["#I-3005", "Arjun Mehta", "App Bug", "Resolved"],
      ],
    },
    Finance: {
      heading: "Transaction Logs",
      columns: ["Txn ID", "Date", "Method", "Amount", "Status"],
      rows: [
        ["#T-8001", "21 Feb 2026", "UPI", "₹220", "Success"],
        ["#T-8002", "21 Feb 2026", "Card", "₹540", "Pending"],
        ["#T-8003", "20 Feb 2026", "Cash", "₹120", "Success"],
        ["#T-8004", "19 Feb 2026", "UPI", "₹300", "Refunded"],
        ["#T-8005", "18 Feb 2026", "Wallet", "₹450", "Success"],
      ],
    },
  };

  // 4. Reset search when tab changes
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const currentTable = tableContent[activeTab];

  const filteredRows = currentTable.rows.filter((row) =>
    row.some((cell) =>
      cell.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          DobelGo Control Center
        </h1>
        <p className="text-gray-500">
          Click on a tab to view detailed records.
        </p>
      </div>

      {/* --- 5 Tabs (Clickable) --- */}
      <div className="flex flex-wrap gap-4 mb-10">
        <DashboardTab
          label="Fleet"
          title="Total Rides"
          value="1,420"
          color="#EAB308"
          isActive={activeTab === "Fleet"}
          onClick={() => setActiveTab("Fleet")}
        />
        <DashboardTab
          label="Drivers"
          title="Active Now"
          value="382"
          color="#22C55E"
          isActive={activeTab === "Drivers"}
          onClick={() => setActiveTab("Drivers")}
        />
        <DashboardTab
          label="Service"
          title="Pending"
          value="14"
          color="#F97316"
          isActive={activeTab === "Service"}
          onClick={() => setActiveTab("Service")}
        />
        <DashboardTab
          label="Issues"
          title="Cancelled"
          value="23"
          color="#EF4444"
          isActive={activeTab === "Issues"}
          onClick={() => setActiveTab("Issues")}
        />
        <DashboardTab
          label="Finance"
          title="Earnings"
          value="₹12,450"
          color="#3B82F6"
          isActive={activeTab === "Finance"}
          onClick={() => setActiveTab("Finance")}
        />
      </div>

      {/* --- Dynamic Table Section --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {currentTable.heading}
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
            <Input
              type="text"
              placeholder="Search"
              className="h-9 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="text-sm font-bold text-yellow-600 hover:underline whitespace-nowrap">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {currentTable.columns.map((col) => (
                  <th
                    key={col}
                    className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentTable.columns.length}
                    className="py-6 px-2 text-sm text-gray-500 text-center"
                  >
                    No records match your search.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="py-4 px-2 text-sm text-gray-600 font-medium"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}