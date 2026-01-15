// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";

// const STORAGE_KEY = "SNV_ADMIN_KEY";

// export default function AdminDashboard() {
//   const nav = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const API_BASE = useMemo(
//     () => import.meta.env.VITE_API_BASE || "http://localhost:5000",
//     []
//   );

//   const key = useMemo(() => localStorage.getItem(STORAGE_KEY) || "", []);

//   const logout = () => {
//     localStorage.removeItem(STORAGE_KEY);
//     nav("/admin");
//   };

//   const load = async () => {
//     setErr("");
//     setLoading(true);
//     try {
//       if (!key) {
//         nav("/admin");
//         return;
//       }

//       const res = await fetch(`${API_BASE}/api/admin/contacts`, {
//         headers: { "x-admin-key": key },
//       });

//       if (res.status === 401) {
//         logout();
//         return;
//       }

//       const data = await res.json();
//       setRows(data?.data || []);
//     } catch (e) {
//       setErr("Failed to load messages. Check backend + CORS.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const del = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/contacts/${id}`, {
//         method: "DELETE",
//         headers: { "x-admin-key": key },
//       });
//       if (!res.ok) return;
//       setRows((p) => p.filter((x) => x._id !== id));
//     } catch {}
//   };

//   return (
//     <section className="min-h-screen bg-[#d9d9d9]">
//         <Header />
//       <div className="mx-auto w-full max-w-[1100px] px-4 py-8">
//         {/* Top bar */}
//         <div className="flex flex-col gap-3 border border-black/20 bg-white/40 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
//               ADMIN DASHBOARD
//             </div>
//             <div className="mt-1 text-xl font-black tracking-wide text-black">
//               Contact Messages
//             </div>
//             <div className="mt-1 text-[12px] font-semibold text-black/60">
//               Total: <span className="font-black">{rows.length}</span>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={load}
//               className="border border-black/25 bg-white/55 px-4 py-2 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
//             >
//               REFRESH
//             </button>
//             <button
//               onClick={logout}
//               className="bg-[#ff5a12] px-4 py-2 text-[12px] font-black tracking-widest text-white shadow-[0_14px_24px_rgba(255,90,18,0.25)] hover:brightness-[1.04] active:translate-y-[1px]"
//             >
//               LOGOUT
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="mt-4 border border-black/20 bg-white/35 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
//           {loading ? (
//             <div className="p-6 text-[13px] font-semibold text-black/70">
//               Loading...
//             </div>
//           ) : err ? (
//             <div className="p-6 text-[13px] font-semibold text-black/70">
//               {err}
//             </div>
//           ) : rows.length === 0 ? (
//             <div className="p-6 text-[13px] font-semibold text-black/70">
//               No messages yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-left">
//                 <thead>
//                   <tr className="border-b border-black/20 text-[11px] font-black tracking-widest text-black/60">
//                     <th className="p-3">NAME</th>
//                     <th className="p-3">EMAIL</th>
//                     <th className="p-3">PHONE</th>
//                     <th className="p-3">MESSAGE</th>
//                     <th className="p-3">DATE</th>
//                     <th className="p-3">ACTION</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((r) => (
//                     <tr key={r._id} className="border-b border-black/10">
//                       <td className="p-3 text-[13px] font-semibold text-black/80">
//                         {r.name}
//                       </td>
//                       <td className="p-3 text-[13px] font-semibold text-black/70">
//                         {r.email}
//                       </td>
//                       <td className="p-3 text-[13px] font-semibold text-black/70">
//                         {r.phone || "-"}
//                       </td>
//                       <td className="p-3 text-[13px] font-semibold text-black/70">
//                         <div className="max-w-[420px] truncate">
//                           {r.message}
//                         </div>
//                       </td>
//                       <td className="p-3 text-[12px] font-semibold text-black/60">
//                         {new Date(r.createdAt).toLocaleString()}
//                       </td>
//                       <td className="p-3">
//                         <button
//                           onClick={() => del(r._id)}
//                           className="border border-black/25 bg-white/55 px-3 py-1.5 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
//                         >
//                           DELETE
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="p-3 text-[11px] font-semibold text-black/55">
//                 Tip: click Refresh to get latest contacts.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

















































// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const STORAGE_KEY = "SNV_ADMIN_KEY";

const normalizeBase = (s) => (s ? s.replace(/\/+$/, "") : s);

export default function AdminDashboard() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [active, setActive] = useState("contact"); // contact | career | all
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const API_BASE = useMemo(() => {
    const fromEnv =
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_BASE ||
      "http://localhost:5000";
    return normalizeBase(fromEnv);
  }, []);

  // ✅ read key dynamically (don’t freeze it with useMemo([]))
  const getKey = () => localStorage.getItem(STORAGE_KEY) || "";

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    nav("/admin", { replace: true });
  };

  const load = async (type = active) => {
    setErr("");
    setLoading(true);

    const key = getKey();
    if (!key) {
      nav("/admin", { replace: true });
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/submissions?type=${encodeURIComponent(type)}`,
        { headers: { "x-admin-key": key } }
      );

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message || "Failed to load data.");
        setRows([]);
        return;
      }

      setRows(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      setErr("Failed to load. Check backend URL / CORS / Render sleeping.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const del = async (id) => {
    const key = getKey();
    if (!key) return logout();

    try {
      const res = await fetch(`${API_BASE}/api/admin/submissions/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": key },
      });

      if (res.status === 401) return logout();
      if (!res.ok) return;

      setRows((p) => p.filter((x) => x._id !== id));
    } catch {}
  };

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setActive(id)}
      className={[
        "border border-black/25 px-4 py-2 text-[12px] font-black tracking-widest active:translate-y-[1px]",
        active === id
          ? "bg-[#ff5a12] text-white shadow-[0_14px_24px_rgba(255,90,18,0.25)]"
          : "bg-white/55 text-black/70 hover:bg-white/80",
      ].join(" ")}
      type="button"
    >
      {label}
    </button>
  );

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
              {active === "contact"
                ? "Contact Messages"
                : active === "career"
                ? "Career Applications"
                : "All Submissions"}
            </div>
            <div className="mt-1 text-[12px] font-semibold text-black/60">
              Total: <span className="font-black">{rows.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TabBtn id="contact" label="CONTACT" />
            <TabBtn id="career" label="CAREER" />
            <TabBtn id="all" label="ALL" />

            <button
              onClick={() => load(active)}
              className="border border-black/25 bg-white/55 px-4 py-2 text-[12px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
              type="button"
            >
              REFRESH
            </button>

            <button
              onClick={logout}
              className="bg-[#ff5a12] px-4 py-2 text-[12px] font-black tracking-widest text-white shadow-[0_14px_24px_rgba(255,90,18,0.25)] hover:brightness-[1.04] active:translate-y-[1px]"
              type="button"
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
              No records yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black/20 text-[11px] font-black tracking-widest text-black/60">
                    <th className="p-3">TYPE</th>
                    <th className="p-3">NAME</th>
                    <th className="p-3">EMAIL</th>
                    <th className="p-3">PHONE</th>

                    {active === "career" || active === "all" ? (
                      <>
                        <th className="p-3">ROLE</th>
                        <th className="p-3">RESUME</th>
                      </>
                    ) : null}

                    <th className="p-3">DETAIL</th>
                    <th className="p-3">DATE</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-b border-black/10">
                      <td className="p-3 text-[12px] font-black text-black/70">
                        {(r.type || "-").toUpperCase()}
                      </td>

                      <td className="p-3 text-[13px] font-semibold text-black/80">
                        {r.name}
                      </td>

                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        {r.email}
                      </td>

                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        {r.phone || "-"}
                      </td>

                      {(active === "career" || active === "all") && (
                        <>
                          <td className="p-3 text-[13px] font-semibold text-black/70">
                            {r.role || "-"}
                          </td>

                          <td className="p-3 text-[13px] font-semibold text-black/70">
                            {r.resumeUrl ? (
                              <a
                                href={r.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline"
                              >
                                OPEN
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </>
                      )}

                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        <div className="max-w-[420px] truncate">
                          {r.type === "career"
                            ? r.coverLetter || r.portfolio || r.linkedin || "-"
                            : r.message || "-"}
                        </div>
                      </td>

                      <td className="p-3 text-[12px] font-semibold text-black/60">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => del(r._id)}
                          className="border border-black/25 bg-white/55 px-3 py-1.5 text-[11px] font-black tracking-widest text-black/70 hover:bg-white/80 active:translate-y-[1px]"
                          type="button"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 text-[11px] font-semibold text-black/55">
                Tip: Use tabs to switch between Contact and Career applications.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

