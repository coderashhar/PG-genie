import React from "react";
import connectToDatabase from "@/lib/db";
import Ticket from "@/models/Ticket";
import Property from "@/models/Property";
import User from "@/models/User";
import Link from "next/link";

// Force dynamic rendering so dashboard is always up to date
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  // Fetch some quick stats
  const totalTickets = await Ticket.countDocuments();
  const openTickets = await Ticket.countDocuments({ status: "open" });
  const totalProperties = await Property.countDocuments();
  const totalUsers = await User.countDocuments();

  const recentTickets = await Ticket.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-h2 font-display font-bold text-on-surface mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
          <div className="text-on-surface-variant text-label-md font-medium mb-2">Open Tickets</div>
          <div className="text-h1 font-display font-bold text-error">{openTickets}</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
          <div className="text-on-surface-variant text-label-md font-medium mb-2">Total Tickets</div>
          <div className="text-h1 font-display font-bold text-on-surface">{totalTickets}</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
          <div className="text-on-surface-variant text-label-md font-medium mb-2">Active PGs</div>
          <div className="text-h1 font-display font-bold text-on-surface">{totalProperties}</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col">
          <div className="text-on-surface-variant text-label-md font-medium mb-2">Total Users</div>
          <div className="text-h1 font-display font-bold text-on-surface">{totalUsers}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <h2 className="text-h3 font-display font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/admin/tickets" className="flex items-center justify-between p-4 bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface">Manage Tickets</div>
                  <div className="text-body-sm text-on-surface-variant">Review and resolve support requests</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
            </Link>

            <Link href="/admin/pgs" className="flex items-center justify-between p-4 bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center">
                  <span className="material-symbols-outlined">gpp_maybe</span>
                </div>
                <div>
                  <div className="font-bold text-on-surface">Moderate Content</div>
                  <div className="text-body-sm text-on-surface-variant">Remove NSFW or spam listings</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
            </Link>
          </div>
        </div>

        {/* Recent Tickets Preview */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 font-display font-bold">Recent Tickets</h2>
            <Link href="/admin/tickets" className="text-primary text-label-md font-bold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentTickets.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">No recent tickets</div>
            ) : (
              recentTickets.map((ticket: any) => (
                <div key={ticket._id.toString()} className="border-b border-outline-variant pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-on-surface line-clamp-1">{ticket.subject}</div>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold ${
                      ticket.status === 'open' ? 'bg-error-container text-error' : 
                      ticket.status === 'in_progress' ? 'bg-secondary-container text-secondary' : 
                      'bg-green-600 text-white'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-body-sm text-on-surface-variant mb-1">{ticket.email}</div>
                  <div className="text-body-sm text-on-surface-variant line-clamp-1 italic">"{ticket.message}"</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
