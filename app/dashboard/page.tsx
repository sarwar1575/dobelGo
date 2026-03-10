"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input/Input";
import {
  Users,
  Car,
  ShieldCheck,
  Landmark,
  Siren,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Clock
} from "lucide-react";
import Link from "next/link";

// --- Premium Stat Card ---
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color
}: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  color: string;
}) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full">
          <TrendingUp size={12} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-gray-900 group-hover:text-white transition-all">
        <ArrowUpRight size={16} />
      </div>
    </div>
  </div>
);

// --- Verification Alert Card ---
const VerificationQuickLink = ({ title, count, href, icon: Icon, color }: any) => (
  <Link href={href} className="flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} text-white shadow-sm`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-gray-800 tracking-tight">{title}</h4>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Review</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-gray-900 border border-gray-100 shadow-sm group-hover:bg-gray-900 group-hover:text-white transition-colors">
        {count}
      </span>
      <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
    </div>
  </Link>
);

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Verification Counts (Mock for UI, could be fetched)
  const [counts, setCounts] = useState({
    drivers: 12,
    vehicles: 8,
    documents: 24,
    bank: 5,
    emergency: 3
  });

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-10">
      {/* Header section with profile glance */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Control <span className="text-yellow-500">Center</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Activity size={12} />
              Systems Active
            </div>
            <p className="text-gray-400 font-medium text-sm">Welcome back, Admin. Here's what's happening today.</p>
          </div>
        </div>

        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Stats and Main Charts Area placeholder */}
        <div className="lg:col-span-2 space-y-10">
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="Total Fleet"
              value="1,420"
              icon={Car}
              trend="+12.5%"
              color="bg-blue-600"
            />
            <StatCard
              title="Active Drivers"
              value="382"
              icon={Users}
              trend="+4.2%"
              color="bg-emerald-500"
            />
            <StatCard
              title="Total Revenue"
              value="₹12.4k"
              icon={Landmark}
              trend="+18.1%"
              color="bg-yellow-500"
            />
            <StatCard
              title="Avg Response"
              value="4.2m"
              icon={Clock}
              color="bg-indigo-600"
            />
          </div> */}

          {/* Activity Table Placeholder */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Recent Activity</h3>
              <Input
                placeholder="Search activity..."
                className="w-64 bg-gray-50 border-none rounded-2xl font-semibold"
              />
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all rounded-2xl px-4 -mx-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">New Driver Onboarded</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">2 mins ago</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-500">DETAILS</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verification Hub */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-gray-50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Verification Hub</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Action</p>
              </div>
            </div>

            <div className="space-y-4">
              <VerificationQuickLink
                title="Drivers"
                count={counts.drivers}
                href="/dashboard/driver-verification"
                icon={Users}
                color="bg-blue-500"
              />
              <VerificationQuickLink
                title="Vehicles"
                count={counts.vehicles}
                href="/dashboard/vehicle-verification"
                icon={Car}
                color="bg-orange-500"
              />
              <VerificationQuickLink
                title="Documents"
                count={counts.documents}
                href="/dashboard/document-verification"
                icon={ShieldCheck}
                color="bg-indigo-600"
              />
              <VerificationQuickLink
                title="Bank Accounts"
                count={counts.bank}
                href="/dashboard/bank-verification"
                icon={Landmark}
                color="bg-emerald-500"
              />
              <VerificationQuickLink
                title="Emergency Contacts"
                count={counts.emergency}
                href="/dashboard/emergency-verification"
                icon={Siren}
                color="bg-rose-600"
              />
            </div>

            <button className="w-full mt-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95">
              View All Reports
            </button>
          </div>

          {/* Secondary Card */}
          {/* <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[3rem] p-10 text-white shadow-xl shadow-yellow-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-black tracking-tight leading-none mb-2">Fleet Expansion</h4>
              <p className="text-white/80 text-sm font-medium mb-8">Onboard 50 new drivers this week to reach target.</p>
              <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                RECRUIT NOW
              </button>
            </div>
            <Activity className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform duration-700" />
          </div> */}
        </div>
      </div>
    </div>
  );
}