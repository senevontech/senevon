// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import { supabase } from "../lib/supabaseClient";

// export default function SupabaseAdminDashboard() {
//   const nav = useNavigate();

//   const [rows, setRows] = useState([]);
//   const [type, setType] = useState("all"); // all | contact | career
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const logout = async () => {
//     try {
//       await supabase.auth.signOut();
//     } finally {
//       nav("/admin", { replace: true });
//     }
//   };

//   const ensureSession = async () => {
//     const { data } = await supabase.auth.getSession();
//     if (!data?.session) {
//       nav("/admin", { replace: true });
//       return null;
//     }
//     return data.session;
//   };

//   const load = async (t = type) => {
//     setErr("");
//     setLoading(true);

//     try {
//       const session = await ensureSession();
//       if (!session) return;

//       let q = supabase
//         .from("submissions")
//         .select("*")
//         .order("created_at", { ascending: false })
//         .limit(500);

//       if (t !== "all") q = q.eq("type", t);

//       const { data, error } = await q;
//       if (error) throw error;

//       setRows(Array.isArray(data) ? data : []);
//     } catch (e) {
//       // Most common: user not in admins table OR RLS blocks select
//       setErr(e?.message || "Failed to load submissions (RLS / admin access / table missing).");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const del = async (id) => {
//     try {
//       const session = await ensureSession();
//       if (!session) return;

//       const { error } = await supabase.from("submissions").delete().eq("id", id);
//       if (error) throw error;

//       setRows((p) => p.filter((x) => x.id !== id));
//     } catch {
//       // keep silent like your old code
//     }
//   };

//   useEffect(() => {
//     load("all");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // If session changes, keep behavior stable
//   useEffect(() => {
//     const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (!session) nav("/supabase", { replace: true });
//     });

//     return () => sub?.subscription?.unsubscribe?.();
//   }, [nav]);

//   return (
//     <section className="min-h-screen bg-[#d9d9d9]">
//       <Header />

//       <div className="mx-auto w-full max-w-[1100px] px-4 py-8">
//         <div className="flex flex-col gap-3 border border-black/20 bg-white/40 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
//               ADMIN DASHBOARD
//             </div>
//             <div className="mt-1 text-xl font-black tracking-wide text-black">
//               Submissions
//             </div>
//             <div className="mt-1 text-[12px] font-semibold text-black/60">
//               Showing: <span className="font-black">{type.toUpperCase()}</span> • Total:{" "}
//               <span className="font-black">{rows.length}</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {["all", "contact", "career"].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => {
//                   setType(t);
//                   load(t);
//                 }}
//                 className={[
//                   "border px-4 py-2 text-[12px] font-black tracking-widest active:translate-y-[1px]",
//                   t === type
//                     ? "border-black/40 bg-white/85 text-black"
//                     : "border-black/25 bg-white/55 text-black/70 hover:bg-white/80",
//                 ].join(" ")}
//               >
//                 {t.toUpperCase()}
//               </button>
//             ))}

//             <button
//               onClick={() => load(type)}
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

//         <div className="mt-4 border border-black/20 bg-white/35 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
//           {loading ? (
//             <div className="p-6 text-[13px] font-semibold text-black/70">
//               Loading...
//             </div>
//           ) : err ? (
//             <div className="p-6 text-[13px] font-semibold text-black/70">
//               {err}
//               <div className="mt-2 text-[12px]">
//                 Tip: Make sure you added your user_id to <b>public.admins</b> and RLS policies are applied.
//               </div>
//             </div>
//           ) : rows.length === 0 ? (
//             <div className="p-6 text-[13px] font-semibold text-black/70">
//               No submissions yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-left">
//                 <thead>
//                   <tr className="border-b border-black/20 text-[11px] font-black tracking-widest text-black/60">
//                     <th className="p-3">TYPE</th>
//                     <th className="p-3">NAME</th>
//                     <th className="p-3">EMAIL</th>
//                     <th className="p-3">PHONE</th>
//                     <th className="p-3">DETAIL</th>
//                     <th className="p-3">DATE</th>
//                     <th className="p-3">ACTION</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {rows.map((r) => (
//                     <tr key={r.id} className="border-b border-black/10">
//                       <td className="p-3 text-[12px] font-black tracking-widest text-black/70">
//                         {String(r.type || "-").toUpperCase()}
//                       </td>

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
//                         {r.type === "career" ? (
//                           <div className="max-w-[420px] truncate">
//                             <b>Role:</b> {r.role || "-"}{" "}
//                             {r.resume_url ? (
//                               <>
//                                 • <b>Resume:</b>{" "}
//                                 <a
//                                   className="underline"
//                                   href={r.resume_url}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                 >
//                                   link
//                                 </a>
//                               </>
//                             ) : null}
//                           </div>
//                         ) : (
//                           <div className="max-w-[420px] truncate">
//                             {r.message || "-"}
//                           </div>
//                         )}
//                       </td>

//                       <td className="p-3 text-[12px] font-semibold text-black/60">
//                         {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
//                       </td>

//                       <td className="p-3">
//                         <button
//                           onClick={() => del(r.id)}
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
//                 Tip: use tabs to switch between Contact & Career.
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }




































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { supabase } from "../lib/supabaseClient";

export default function SupabaseAdminDashboard() {
  const nav = useNavigate();

  const [rows, setRows] = useState([]);
  const [type, setType] = useState("all"); 
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      nav("/admin", { replace: true });
    }
  };

  const ensureSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) {
      nav("/admin", { replace: true });
      return null;
    }
    return data.session;
  };

  const normalizeContactRow = (r) => ({
    id: r.id,
    type: "contact",
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    role: null,
    resume_url: null,
    created_at: r.created_at || r.createdAt || null,
  });

  // If you have a career table, put it here.
  // If you DON'T have it yet, keep it empty and the CAREER tab will show none.
  const loadCareer = async () => {
    // Example (only if you created a "career_applications" table):
    // const { data, error } = await supabase
    //   .from("career_applications")
    //   .select("*")
    //   .order("created_at", { ascending: false })
    //   .limit(500);
    // if (error) throw error;
    // return (data || []).map((r) => ({
    //   id: r.id,
    //   type: "career",
    //   name: r.name,
    //   email: r.email,
    //   phone: r.phone,
    //   message: null,
    //   role: r.role,
    //   resume_url: r.resume_url,
    //   created_at: r.created_at,
    // }));

    return [];
  };

  const loadContact = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("id", { ascending: false })
      .limit(500);

    if (error) throw error;
    return (data || []).map(normalizeContactRow);
  };

  const load = async (t = type) => {
    setErr("");
    setLoading(true);

    try {
      const session = await ensureSession();
      if (!session) return;

      if (t === "contact") {
        setRows(await loadContact());
        return;
      }

      if (t === "career") {
        setRows(await loadCareer());
        return;
      }

      // t === "all" -> merge
      const [contactRows, careerRows] = await Promise.all([
        loadContact(),
        loadCareer(),
      ]);

      const merged = [...contactRows, ...careerRows].sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });

      setRows(merged);
    } catch (e) {
      setErr(e?.message || "Failed to load submissions (RLS / admin access / table missing).");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    try {
      const session = await ensureSession();
      if (!session) return;

      // delete based on current tab type
      if (type === "career") {
        // Example if you have career table:
        // const { error } = await supabase.from("career_applications").delete().eq("id", id);
        // if (error) throw error;
      } else {
        const { error } = await supabase.from("contact_messages").delete().eq("id", id);
        if (error) throw error;
      }

      setRows((p) => p.filter((x) => x.id !== id));
    } catch {
      // silent
    }
  };

  useEffect(() => {
    load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav("/admin", { replace: true });
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, [nav]);

  return (
    <section className="min-h-screen bg-[#d9d9d9]">
      <Header />

      <div className="mx-auto w-full max-w-[1100px] px-4 py-8">
        <div className="flex flex-col gap-3 border border-black/20 bg-white/40 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
              ADMIN DASHBOARD
            </div>
            <div className="mt-1 text-xl font-black tracking-wide text-black">
              Submissions
            </div>
            <div className="mt-1 text-[12px] font-semibold text-black/60">
              Showing: <span className="font-black">{type.toUpperCase()}</span> • Total:{" "}
              <span className="font-black">{rows.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "contact", "career"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  load(t);
                }}
                className={[
                  "border px-4 py-2 text-[12px] font-black tracking-widest active:translate-y-[1px]",
                  t === type
                    ? "border-black/40 bg-white/85 text-black"
                    : "border-black/25 bg-white/55 text-black/70 hover:bg-white/80",
                ].join(" ")}
              >
                {t.toUpperCase()}
              </button>
            ))}

            <button
              onClick={() => load(type)}
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

        <div className="mt-4 border border-black/20 bg-white/35 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          {loading ? (
            <div className="p-6 text-[13px] font-semibold text-black/70">
              Loading...
            </div>
          ) : err ? (
            <div className="p-6 text-[13px] font-semibold text-black/70">
              {err}
              <div className="mt-2 text-[12px]">
                Tip: Ensure RLS policies exist for <b>contact_messages</b> too (not only submissions).
              </div>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-[13px] font-semibold text-black/70">
              No submissions yet.
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
                    <th className="p-3">DETAIL</th>
                    <th className="p-3">DATE</th>
                    <th className="p-3">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-black/10">
                      <td className="p-3 text-[12px] font-black tracking-widest text-black/70">
                        {String(r.type || "-").toUpperCase()}
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

                      <td className="p-3 text-[13px] font-semibold text-black/70">
                        {r.type === "career" ? (
                          <div className="max-w-[420px] truncate">
                            <b>Role:</b> {r.role || "-"}{" "}
                            {r.resume_url ? (
                              <>
                                • <b>Resume:</b>{" "}
                                <a className="underline" href={r.resume_url} target="_blank" rel="noreferrer">
                                  link
                                </a>
                              </>
                            ) : null}
                          </div>
                        ) : (
                          <div className="max-w-[420px] truncate">
                            {r.message || "-"}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-[12px] font-semibold text-black/60">
                        {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => del(r.id)}
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
                Tip: use tabs to switch between Contact & Career.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
