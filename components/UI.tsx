import React from 'react';

export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/95 rounded-2xl shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-200 px-5 py-3 bg-slate-50 rounded-t-2xl">
        <h3 className="text-slate-900 font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={["w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-sky-600/40 focus:border-sky-600", props.className || ""].join(" ")}
    />
  );
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={["w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white",
        "focus:outline-none focus:ring-2 focus:ring-sky-600/40 focus:border-sky-600", props.className || ""].join(" ")}
    />
  );
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={["w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-sky-600/40 focus:border-sky-600", props.className || ""].join(" ")}
    />
  );
}
