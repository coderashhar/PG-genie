"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminPGsPage() {
  const [pgs, setPgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [pgToDelete, setPgToDelete] = useState<string | null>(null);

  const fetchPGs = async () => {
    try {
      const res = await fetch(`/api/admin/pgs?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setPgs(data.properties);
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

  const confirmDelete = async (id: string) => {
    setPgToDelete(null);
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/pgs/${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("Listing permanently deleted");
        setPgs(pgs.filter(pg => pg._id !== id));
      } else {
        toast.error(data.error || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-h2 font-display font-bold text-on-surface">PG Moderation</h1>
        
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

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        {isLoading && pgs.length === 0 ? (
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
                {pgs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">No listings found</td>
                  </tr>
                ) : (
                  pgs.map((pg) => (
                    <tr key={pg._id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          {pg.images && pg.images.length > 0 ? (
                            <img src={pg.images[0]} alt={pg.name} className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-on-surface-variant">home</span>
                            </div>
                          )}
                          <div>
                            <a href={`/pgs/${pg._id}`} target="_blank" className="font-bold text-primary hover:underline line-clamp-1">{pg.name}</a>
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">{pg.type} • {pg.gender}</div>
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
                        ₹{pg.rent?.toLocaleString()}/mo
                      </td>
                      <td className="p-4 align-top text-right">
                        <button
                          onClick={() => setPgToDelete(pg._id)}
                          disabled={isDeleting === pg._id}
                          className="px-3 py-1.5 rounded-lg bg-error/10 text-error font-medium text-body-sm hover:bg-error hover:text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                          title="Permanently Delete Listing"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                          {isDeleting === pg._id ? "Deleting..." : "Delete (NSFW)"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {pgToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-xl border border-outline-variant animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="text-h3 font-display font-bold text-center mb-2">Delete Listing?</h3>
            <p className="text-body-md text-on-surface-variant text-center mb-8">
              Are you ABSOLUTELY sure? This will permanently delete the PG and remove it from users' saved lists. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setPgToDelete(null)}
                className="flex-1 h-12 rounded-full border border-outline-variant bg-surface text-on-surface font-label-lg font-bold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(pgToDelete)}
                className="flex-1 h-12 rounded-full bg-error text-white font-label-lg font-bold hover:bg-error/90 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
