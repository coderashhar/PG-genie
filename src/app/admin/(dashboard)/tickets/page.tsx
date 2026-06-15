"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets);
      } else {
        toast.error(data.error || "Failed to fetch tickets");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success("Ticket updated");
        setTickets(tickets.map(t => t._id === id ? { ...t, status: newStatus } : t));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update ticket");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-h2 font-display font-bold text-on-surface mb-8">Support Tickets</h1>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-label-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-outline-variant">Date</th>
                <th className="p-4 font-bold border-b border-outline-variant">User</th>
                <th className="p-4 font-bold border-b border-outline-variant">Subject / Message</th>
                <th className="p-4 font-bold border-b border-outline-variant">Status</th>
                <th className="p-4 font-bold border-b border-outline-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">No tickets found</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="p-4 text-body-sm align-top whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString()}<br />
                      <span className="text-[10px] text-on-surface-variant">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="p-4 text-body-sm align-top">
                      <div className="font-bold text-on-surface">{ticket.name}</div>
                      <div className="text-on-surface-variant">{ticket.email}</div>
                    </td>
                    <td className="p-4 text-body-sm align-top min-w-[300px]">
                      <div className="font-bold text-on-surface mb-1">{ticket.subject}</div>
                      <div className="text-on-surface-variant">{ticket.message}</div>
                    </td>
                    <td className="p-4 align-top">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold ${ticket.status === 'open' ? 'bg-error-container text-error' :
                        ticket.status === 'in_progress' ? 'bg-secondary-container text-secondary' :
                          'bg-green-600 text-green-900 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 align-top text-right">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket._id, e.target.value)}
                        className="bg-surface text-on-surface border border-outline-variant text-body-sm rounded-lg px-2 py-1 outline-none focus:border-primary"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
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
}
