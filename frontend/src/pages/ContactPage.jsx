import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/contact/";
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(API_URL, {   // <-- yahan API_URL likhain
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">Available for work</p>
          <h1 className="text-3xl font-semibold tracking-tight">Let's build something</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Share a few details about your project — I'll reply within 24 hours.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
          {status === "success" && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-3 py-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>Message sent. I'll get back to you soon.</span>
            </div>
          )}
          {status === "error" && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-3 py-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>Something went wrong. Please try again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1.5">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-slate-400 mb-1.5">
                Phone <span className="text-slate-600">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                placeholder="03xx xxxxxxx"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1.5">
                Project details
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
                placeholder="Tell me what you're building..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-slate-950 font-medium text-sm px-4 py-2.5 transition-colors"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
