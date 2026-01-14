import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const STORAGE_KEY = "SNV_ADMIN_KEY";

export default function AdminDashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const API_BASE = useMemo(
    () => import.meta.env.VITE_API_BASE || "http://localhost:5000",
    []
  );

  const key = useMemo(() => localStorage.getItem(STORAGE_KEY) || "", []);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    nav("/admin");
  };

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      if (!key) {
        nav("/admin");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/contacts`, {
        headers: { "x-admin-key": key },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setRows(data?.data || []);
    } catch (e) {
      setErr("Failed to load messages. Check backend + CORS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const del = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": key },
      });
      if (!res.ok) return;
      setRows((p) => p.filter((x) => x._id !== id));
    } catch {}
  };

  return (
    <section className="min-h-screen bg-[#d9d9d9]">
        <Header />
      <div className="mx-auto w-full max-w-[1100px] px-4 py-8">
        {/* Top bar */}
        <div className="flex flex-col gap-3 border border-black/20 bg-white/40 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
              ADMIN DASHBOARD
            </div>
            <div className="mt-1 text-xl font-black tracking-wide text-black">
              Contact Messages
            </div>
            <div className="mt-1 text-[12px] font-semibold text-black/60">
              Total: <span className="font-black">{rows.length}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={load}
              className="border border-black/25 bg-white/55 px-4 py-2 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
            >
              REFRESH
            </button>
            <button
              onClick={logout}
              className="bg-[#ff5a12] px-4 py-2 text-[12px] font-black tracking-widest text-white shadow-[0_14px_24px_rgba(255,90,18,0.25)] hover:brightness-[1.04] active:translate-y-[1px]"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 border border-black/20 bg-white/35 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          {loading ? (
            <div className="p-6 text-[13px] font-semibold text-black/70">
              Loading...
            </div>
          ) : err ? (
            <div className="p-6 text-[13px] font-semibold text-black/70">
              {err}
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-[13px] font-semibold text-black/70">
              No messages yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/20 text-[11px] font-black tracking-widest text-black/60">
                    <th className="p-3">NAME</th>
                    <th className="p-3">EMAIL</th>
                    <th className="p-3">PHONE</th>
                    <th className="p-3">MESSAGE</th>
                    <th className="p-3">DATE</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-b border-black/10">
                      <td className="p-3 text-[13px] font-semibold text-black/80">
                        {r.name}
                      </td>
                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        {r.email}
                      </td>
                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        {r.phone || "-"}
                      </td>
                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        <div className="max-w-[420px] truncate">
                          {r.message}
                        </div>
                      </td>
                      <td className="p-3 text-[12px] font-semibold text-black/60">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => del(r._id)}
                          className="border border-black/25 bg-white/55 px-3 py-1.5 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 text-[11px] font-semibold text-black/55">
                Tip: click Refresh to get latest contacts.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
