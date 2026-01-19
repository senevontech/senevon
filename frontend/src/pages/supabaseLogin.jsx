import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { supabase } from "../lib/supabaseClient";

export default function AdminAuth() {
  const nav = useNavigate();

  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" }); // success|error

  const envOk = useMemo(() => {
    return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }, []);

  // If already logged in -> go dashboard
  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      if (data?.session) nav("/admin/dashboard");
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) nav("/admin/dashboard");
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!envOk) {
      setMsg({ type: "error", text: "Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." });
      return;
    }
    if (!email.trim()) {
      setMsg({ type: "error", text: "Email is required." });
      return;
    }
    if (!password || password.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMsg({
          type: "success",
          text: "Signup successful. If email confirmation is enabled, check your inbox.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMsg({ type: "success", text: "Login successful. Redirecting..." });
        // redirect happens via auth listener
      }
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Auth failed." });
    } finally {
      setLoading(false);
    }
  };

  const sendReset = async () => {
    setMsg({ type: "", text: "" });

    if (!envOk) {
      setMsg({ type: "error", text: "Supabase env missing." });
      return;
    }
    if (!email.trim()) {
      setMsg({ type: "error", text: "Enter your email first." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/admin/reset",
      });
      if (error) throw error;

      setMsg({ type: "success", text: "Password reset link sent to your email." });
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Failed to send reset link." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#d9d9d9]">
      <Header />

      <div className="mx-auto w-full max-w-[520px] px-4 py-10">
        {/* Header Card */}
        <div className="border border-black/20 bg-white/40 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          <div className="text-[11px] font-black tracking-[0.22em] text-black/55">
            ADMIN
          </div>
          <div className="mt-1 text-2xl font-black tracking-wide text-black">
            {mode === "signup" ? "Create Account" : "Login"}
          </div>
          <div className="mt-2 text-[13px] font-semibold text-black/60">
            {mode === "signup"
              ? "Create a Supabase admin account to access the dashboard."
              : "Login with your Supabase admin account."}
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={onSubmit}
          className="mt-4 border border-black/20 bg-white/35 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
        >
          {/* Mode Toggle */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={[
                "flex-1 border border-black/20 px-4 py-2 text-[12px] font-black tracking-widest",
                mode === "login" ? "bg-black/80 text-white" : "bg-white/55 text-black/70 hover:bg-white/75",
              ].join(" ")}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={[
                "flex-1 border border-black/20 px-4 py-2 text-[12px] font-black tracking-widest",
                mode === "signup" ? "bg-black/80 text-white" : "bg-white/55 text-black/70 hover:bg-white/75",
              ].join(" ")}
            >
              SIGN UP
            </button>
          </div>

          {/* Email */}
          <label className="grid gap-2">
            <span className="text-[12px] font-black tracking-widest text-black/70">
              EMAIL
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="
                w-full border border-black/25 bg-white/75 px-3 py-2
                text-[13px] font-semibold text-black/80 outline-none
                focus:border-black/50
              "
              placeholder="admin@senevon.in"
              autoComplete="email"
            />
          </label>

          {/* Password */}
          <label className="mt-3 grid gap-2">
            <span className="text-[12px] font-black tracking-widest text-black/70">
              PASSWORD
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="
                w-full border border-black/25 bg-white/75 px-3 py-2
                text-[13px] font-semibold text-black/80 outline-none
                focus:border-black/50
              "
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>

          {/* Message */}
          {msg.text ? (
            <div className="mt-3 border border-black/20 bg-white/60 px-3 py-2 text-[12px] font-semibold text-black/70">
              {msg.text}
            </div>
          ) : null}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-4 w-full bg-[#ff5a12] px-5 py-3
              text-[12px] font-black tracking-widest text-white
              shadow-[0_18px_30px_rgba(255,90,18,0.25)]
              hover:brightness-[1.04]
              active:translate-y-[1px]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "PLEASE WAIT..." : mode === "signup" ? "CREATE ACCOUNT" : "LOGIN"}
          </button>

          {/* Reset */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={sendReset}
              disabled={loading}
              className="text-[12px] font-black tracking-widest text-black/60 hover:text-black disabled:opacity-60"
            >
              FORGOT PASSWORD
            </button>

            {/* <div className="text-[11px] font-semibold text-black/55">
              Supabase:{" "}
              <span className="font-black text-black/70">
                {envOk ? "Connected" : "Missing env"}
              </span>
            </div> */}
          </div>
        </form>
      </div>
    </section>
  );
}
