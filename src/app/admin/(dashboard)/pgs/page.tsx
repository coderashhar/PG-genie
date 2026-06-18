"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminPGsPage() {
  const [pgs, setPgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'rejected'>('pending');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchPGs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/pgs?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setPgs(data.properties || []);
      } else {
        toast.error(data.error || "Failed to fetch properties");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPGs();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const updateStatus = async (id: string, status: 'active' | 'rejected') => {
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/admin/pgs/${id}/status`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(`Listing ${status === 'active' ? 'approved' : 'rejected'}`);
        setPgs(pgs.map(pg => pg._id === id ? { ...pg, status } : pg));
      } else {
        toast.error(data.error || "Failed to update listing status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredPgs = pgs.filter(pg => pg.status === activeTab);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-h2 font-display font-bold text-on-surface">Review Queue</h1>
        
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 border-b border-outline-variant mb-6">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'pending' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Pending Review
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'active' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Approved
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`pb-2 font-bold transition-colors ${activeTab === 'rejected' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          Rejected
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64"><span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-label-sm uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-outline-variant">Property Name</th>
                  <th className="p-4 font-bold border-b border-outline-variant">Owner</th>
                  <th className="p-4 font-bold border-b border-outline-variant">Location</th>
                  <th className="p-4 font-bold border-b border-outline-variant">Price</th>
                  <th className="p-4 font-bold border-b border-outline-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredPgs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">No {activeTab} listings found</td>
                  </tr>
                ) : (
                  filteredPgs.map((pg) => (
                    <tr key={pg._id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          {pg.images && pg.images.length > 0 ? (
                            <Image 
                              src={pg.images[0]} 
                              alt={pg.title} 
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-on-surface-variant">home</span>
                            </div>
                          )}
                          <div>
                            <a href={`/pgs/${pg._id}`} target="_blank" className="font-bold text-primary hover:underline line-clamp-1">{pg.title}</a>
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">{pg.roomTypes?.[0] || 'Room'} • {pg.gender || 'Any'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-body-sm align-top">
                        {pg.ownerId ? (
                          <>
                            <div className="font-bold text-on-surface">{pg.ownerId.name}</div>
                            <div className="text-on-surface-variant">{pg.ownerId.email}</div>
                          </>
                        ) : (
                          <span className="text-on-surface-variant italic">Unknown</span>
                        )}
                      </td>
                      <td className="p-4 text-body-sm align-top text-on-surface-variant">
                        <div className="line-clamp-2">{pg.location?.address}</div>
                      </td>
                      <td className="p-4 text-body-sm font-bold align-top">
                        ₹{pg.price?.toLocaleString()}/mo
                      </td>
                      <td className="p-4 align-top text-right">
                        <div className="flex justify-end gap-2">
                          {activeTab !== 'active' && (
                            <button
                              onClick={() => updateStatus(pg._id, 'active')}
                              disabled={isUpdating === pg._id}
                              className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary font-medium text-body-sm hover:bg-secondary hover:text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                              title="Approve Listing"
                            >
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              Approve
                            </button>
                          )}
                          {activeTab !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(pg._id, 'rejected')}
                              disabled={isUpdating === pg._id}
                              className="px-3 py-1.5 rounded-lg bg-error/10 text-error font-medium text-body-sm hover:bg-error hover:text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                              title="Reject Listing"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
