

// // src/pages/AdminLogin.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";

// const STORAGE_KEY = "SNV_ADMIN_KEY";

// const normalizeBase = (s) => (s ? s.replace(/\/+$/, "") : s);

// export default function AdminLogin() {
//   const nav = useNavigate();
//   const [secret, setSecret] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   // ✅ Supports either env name (pick one and keep it consistent)
//   const API_BASE = useMemo(() => {
//     const fromEnv =
//       import.meta.env.VITE_API_URL ||
//       import.meta.env.VITE_API_BASE ||
//       "http://localhost:5000";

//     return normalizeBase(fromEnv);
//   }, []);

//   // ✅ Verify saved key (don’t blindly redirect)
//   useEffect(() => {
//     const boot = async () => {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       if (!saved) return;

//       try {
//         const res = await fetch(`${API_BASE}/api/admin/contacts`, {
//           method: "GET",
//           headers: { "x-admin-key": saved },
//         });

//         if (res.ok) {
//           nav("/admin/dashboard", { replace: true });
//         } else {
//           // saved key is invalid → remove it
//           localStorage.removeItem(STORAGE_KEY);
//         }
//       } catch {
//         // if backend sleeping/down, don't auto redirect.
//         // user can login again after backend wakes.
//       }
//     };

//     boot();
//   }, [API_BASE, nav]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr("");

//     const key = secret.trim();
//     if (!key) {
//       setErr("Secret key is required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/contacts`, {
//         method: "GET",
//         headers: { "x-admin-key": key },
//       });

//       if (res.status === 401) {
//         setErr("Invalid secret key.");
//         setLoading(false);
//         return;
//       }

//       if (!res.ok) {
//         setErr("Login failed. Please try again.");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem(STORAGE_KEY, key);
//       nav("/admin/dashboard", { replace: true });
//     } catch (e2) {
//       setErr(
//         "Server not reachable. Check VITE_API_URL and backend status (Render may be sleeping)."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="min-h-screen bg-[#d9d9d9]">
//       <Header />

//       <div className="mx-auto w-full max-w-[520px] px-4 py-10">
//         <div className="border border-black/20 bg-white/40 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
//           <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
//             ADMIN
//           </div>
//           <div className="mt-1 text-2xl font-black tracking-wide text-black">
//             Login
//           </div>
//           <div className="mt-2 text-[13px] font-semibold text-black/60">
//             Enter the secret key to access the contact dashboard.
//           </div>
//         </div>

//         <form
//           onSubmit={onSubmit}
//           className="mt-4 border border-black/20 bg-white/35 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
//         >
//           <label className="grid gap-2">
//             <span className="text-[12px] font-black tracking-widest text-black/70">
//               SECRET KEY
//             </span>

//             <input
//               value={secret}
//               onChange={(e) => setSecret(e.target.value)}
//               type="password"
//               className="
//                 w-full border border-black/25 bg-white/75 px-3 py-2
//                 text-[13px] font-semibold text-black/80 outline-none
//                 focus:border-black/50
//               "
//               placeholder="Enter admin key..."
//               autoComplete="current-password"
//             />
//           </label>

//           {err ? (
//             <div className="mt-3 border border-black/20 bg-white/60 px-3 py-2 text-[12px] font-semibold text-black/70">
//               {err}
//             </div>
//           ) : null}

//           <button
//             type="submit"
//             disabled={loading}
//             className="
//               mt-4 w-full bg-[#ff5a12] px-5 py-3
//               text-[12px] font-black tracking-widest text-white
//               shadow-[0_18px_30px_rgba(255,90,18,0.25)]
//               hover:brightness-[1.04]
//               active:translate-y-[1px]
//               disabled:opacity-60 disabled:cursor-not-allowed
//             "
//           >
//             {loading ? "VERIFYING..." : "LOGIN"}
//           </button>

//           {/* <div className="mt-4 text-[12px] font-semibold text-black/55">
//             Backend: <span className="font-black text-black/70">{API_BASE}</span>
//           </div> */}
//         </form>
//       </div>
//     </section>
//   );
// }



























// src/pages/AdminLogin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const STORAGE_KEY = "SNV_ADMIN_KEY";
const normalizeBase = (s) => (s ? String(s).replace(/\/+$/, "") : s);

export default function AdminLogin() {
  const nav = useNavigate();
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const API_BASE = useMemo(() => {
    const fromEnv =
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_BASE ||
      "http://localhost:5000";
    return normalizeBase(fromEnv);
  }, []);

  // validate saved key (don’t blindly redirect)
  useEffect(() => {
    const boot = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const res = await fetch(`${API_BASE}/api/admin/submissions?type=all`, {
          headers: { "x-admin-key": saved },
        });

        if (res.ok) nav("/admin/dashboard", { replace: true });
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        // backend may be sleeping — don't auto redirect
      }
    };
    boot();
  }, [API_BASE, nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const key = secret.trim();
    if (!key) return setErr("Secret key is required.");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/submissions?type=all`, {
        headers: { "x-admin-key": key },
      });

      if (res.status === 401) {
        setErr("Invalid secret key.");
        return;
      }
      if (!res.ok) {
        setErr("Login failed. Please try again.");
        return;
      }

      localStorage.setItem(STORAGE_KEY, key);
      nav("/admin/dashboard", { replace: true });
    } catch {
      setErr(
        "Server not reachable. Check VITE_API_URL in Render frontend env and backend status."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#d9d9d9]">
      <Header />

      <div className="mx-auto w-full max-w-[520px] px-4 py-10">
        <div className="border border-black/20 bg-white/40 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
            ADMIN
          </div>
          <div className="mt-1 text-2xl font-black tracking-wide text-black">
            Login
          </div>
          <div className="mt-2 text-[13px] font-semibold text-black/60">
            Enter the secret key to access the admin dashboard.
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-4 border border-black/20 bg-white/35 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
        >
          <label className="grid gap-2">
            <span className="text-[12px] font-black tracking-widest text-black/70">
              SECRET KEY
            </span>

            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              type="password"
              className="w-full border border-black/25 bg-white/75 px-3 py-2 text-[13px] font-semibold text-black/80 outline-none focus:border-black/50"
              placeholder="Enter admin key..."
              autoComplete="current-password"
            />
          </label>

          {err ? (
            <div className="mt-3 border border-black/20 bg-white/60 px-3 py-2 text-[12px] font-semibold text-black/70">
              {err}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-[#ff5a12] px-5 py-3 text-[12px] font-black tracking-widest text-white shadow-[0_18px_30px_rgba(255,90,18,0.25)] hover:brightness-[1.04] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "VERIFYING..." : "LOGIN"}
          </button>

          <div className="mt-4 text-[12px] font-semibold text-black/55">
            API: <span className="font-black text-black/70">{API_BASE}</span>
          </div>
        </form>
      </div>
    </section>
  );
}






















